import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import DragAndDrop from '../components/DragAndDrop'
import Alert from '../components/Alert'
import Card from '../components/Card'
import styles from '../styles/Home.module.css'
import fbarStyles from '../styles/Fbar.module.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/web-utils/pdf.worker.min.js'

interface SaldoRow {
  date: string
  description: string
  saldo: number
}

type RowItem = { x: number; text: string }

async function parsePdfSaldos(arrayBuffer: ArrayBuffer): Promise<SaldoRow[]> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const rows: SaldoRow[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    // Group text items into rows by approximate y-position
    const rowMap = new Map<number, Array<{ x: number; text: string }>>()

    for (const item of textContent.items) {
      if (!('str' in item) || !item.str.trim()) continue
      const x = item.transform[4] as number
      const y = item.transform[5] as number

      let rowKey: number | undefined
      Array.from(rowMap.keys()).forEach((key: number) => {
        if (rowKey === undefined && Math.abs(key - y) < 4) rowKey = key
      })
      if (rowKey === undefined) {
        rowKey = y
        rowMap.set(rowKey, [])
      }
      rowMap.get(rowKey)!.push({ x, text: item.str.trim() })
    }

    // Process rows top-to-bottom (PDF y is bottom-up, so sort descending)
    const sortedRows = Array.from(rowMap.entries()).sort(
      (a: [number, RowItem[]], b: [number, RowItem[]]) => b[0] - a[0]
    )

    for (const [, items] of sortedRows) {
      items.sort((a: RowItem, b: RowItem) => a.x - b.x)

      // Row must start with a date DD/MM/YYYY
      const firstText = items[0]?.text ?? ''
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(firstText)) continue

      // Find all money-shaped values (e.g. "2,685.11", "197.75")
      const numericItems = items.filter((item: RowItem) =>
        /^\d[\d,]*\.\d{2}$/.test(item.text)
      )
      if (numericItems.length === 0) continue

      // The rightmost numeric item is Saldo Acumulado
      const saldoItem = numericItems.reduce((max: RowItem, item: RowItem) =>
        item.x > max.x ? item : max
      )
      const saldo = parseFloat(saldoItem.text.replace(/,/g, ''))
      if (isNaN(saldo)) continue

      // Everything between date and saldo is description
      const description = items
        .filter((item: RowItem) => item.text !== firstText && item !== saldoItem)
        .map((item: RowItem) => item.text)
        .join(' ')

      rows.push({ date: firstText, description, saldo })
    }
  }

  return rows
}

const PromericaFbar: NextPage = () => {
  const [error, setError] = useState<string>()
  const [filenames, setFilenames] = useState<string[]>([])
  const [rows, setRows] = useState<SaldoRow[]>([])

  async function handleChangeFiles(files: File[]) {
    setError(undefined)
    setRows([])
    setFilenames(Array.from(files).map(f => f.name))

    try {
      const allRows = (await Promise.all(
        Array.from(files).map(async file => {
          const arrayBuffer = await file.arrayBuffer()
          return parsePdfSaldos(arrayBuffer)
        })
      )).flat()

      if (allRows.length === 0) throw new Error('No transaction rows found — PDF format may have changed.')
      allRows.sort((a, b) => {
        // dates are DD/MM/YYYY — sort chronologically
        const parse = (d: string) => d.split('/').reverse().join('')
        return parse(a.date).localeCompare(parse(b.date))
      })
      setRows(allRows)
    } catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  const maxSaldo = rows.length > 0 ? Math.max(...rows.map(r => r.saldo)) : null
  const maxRow = rows.find(r => r.saldo === maxSaldo)
  const dateRange = rows.length > 0 ? `${rows[0].date} – ${rows[rows.length - 1].date}` : undefined

  return (
    <div className={styles.container}>
      <Head>
        <title>Promerica FBAR – Web Utils</title>
        <meta name="description" content="Promerica FBAR helper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Promerica FBAR</h1>

        <p className={styles.description}>
          US persons with foreign bank accounts exceeding $10,000 at any point during the year must file an FBAR
          (FinCEN Form 114). The key figure required per account is the <strong>highest balance held at any point
          during the calendar year</strong> — not the year-end balance. Drop in one or more Promerica monthly PDF
          statements and this tool scans the <em>Saldo Acumulado</em> (running balance) column across all of them
          to surface that number.
        </p>

        <DragAndDrop
          onChangeFiles={handleChangeFiles}
          acceptType=".pdf"
          filenames={filenames.length > 0 ? filenames : undefined}
        />
        {error && <Alert>{error}</Alert>}

        {rows.length > 0 && (
          <div className={fbarStyles.tableWrapper}>
            <table className={fbarStyles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className={fbarStyles.number}>Saldo Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={row.saldo === maxSaldo ? fbarStyles.maxRow : ''}>
                    <td>{row.date}</td>
                    <td>{row.description}</td>
                    <td className={fbarStyles.number}>
                      {row.saldo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Card
              label="Highest value"
              sublabel={dateRange}
              value={maxSaldo?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? ''}
              detail={`on ${maxRow?.date}`}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default PromericaFbar

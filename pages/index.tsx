import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { xor } from 'lodash'
import { DateTime } from 'luxon'
import { CSVLink } from 'react-csv'
import cheerio from 'cheerio'
const HtmlTableToJson = require('html-table-to-json')

import DragAndDrop from '../components/DragAndDrop'
import styles from '../styles/Home.module.css'
import { isTruthy } from '../utils/ts'
import Alert from '../components/Alert'


enum Modifications {
  dateFormat = 'dateFormat',
}

const CommonCsvHeaders = [
  { label: 'Date', key: 'Fecha' },
  { label: 'Document', key: 'Documento' },
  { label: 'Description', key: 'Descripción' },
  { label: 'Debit', key: 'Débitos' },
  { label: 'Credit', key: 'Créditos' },
]

const Home: NextPage = () => {
  const [error, setError] = useState<string>()
  const [csvData, setCsvData] = useState<{ [key: string ]: string }[]>([])
  const [filename, setFilename] = useState('')
  const [modifications, setModifications] = useState<Modifications[]>([
    Modifications.dateFormat,
  ])

  /** This worked in 2022-08, but stopped working in 2022-09 */
  // function preprocessHtml(fileStr: string) {
  //   const tableId = 'data-table'
  //   // add an ID to the table, to use as a selector
  //   fileStr = fileStr.replace(
  //     /(\<table)(\ style\=\"width:115%\;\ padding-top\:10px\;\"\>)/,
  //     (match, g1, g2) => [g1, ` id="${tableId}"`, g2].join('')
  //   )
  //
  //   const innerTable = cheerio.load(fileStr)(`#${tableId} table`)
  //   // change the first row's <td>s into <th>s
  //   // @ts-ignore
  //   innerTable.find('tr').first().find('td').each((i: number, item: Element) => item.tagName = 'th')
  //
  //   // remove second row of table, since it's a statement summary
  //   const secondRow = innerTable.find('tr:nth-child(2)')
  //   if (!secondRow.text().includes('Saldo Inicial')) {
  //     throw new Error('table format changed. Second row was not "Saldo Inicial"')
  //   }
  //   secondRow.remove()
  //
  //   return innerTable.toString()
  // }

  /** Working as of 2022-10 */
  function preprocessHtml(fileStr: string) {
    const $ = cheerio.load(fileStr)
    const innerTable = $('td:contains("Fecha")')
      .filter((_, td) => $(td).text() === 'Fecha') // there's more than <td> with "*Fecha*" in it
      .parents('table').first()

    // change the first row's <td>s into <th>s
    // @ts-ignore
    innerTable.find('tr').first().find('td').each((i: number, item: Element) => item.tagName = 'th')

    return innerTable.toString()
  }

  function handleReaderResult(fileStr: string) {
    try {
      const preproccedHtml = preprocessHtml(fileStr)
      const jsonTables = HtmlTableToJson.parse(preproccedHtml)
      if (jsonTables.count !== 1) {
        throw new Error('html format changed. more than one table found')
      }
      setCsvData(jsonTables.results[0])

      /** Tabletojson Implementation */
      // const tableJson = Tabletojson.convert(innerTable.toString())[0]
      // const [firstItem, ...dataArr] = tableJson
      // if (!firstItem.Fecha.includes('Saldo Inicial')) {
      //   throw new Error('table format changed. Second row was not "Saldo Inicial"')
      // }
      // setCsvOutput('fix')

      /** tabletoCsv Implementation */
      // const csvString = tableToCsv(innerTable.toString())
      // const output = csvString.replace(/^\"(\d{1,2}\/\d{1,2}\/\d{4})\"/gm, (match:string, g1: string) => (
      //   `"${DateTime.fromFormat(g1, 'd/M/yyyy').toFormat('MM/dd/yyyy')}"`
      // ))
      // setCsvOutput(output.split('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  function handleChangeFiles(files: File[]) {
    setError(undefined)
    if (files.length !== 1) throw new Error('more than one file was included')
    const file = files[0]
    setFilename(file.name)

    const reader = new FileReader()
    reader.onload = function() {
      if (reader.result != null && typeof reader.result === 'string') {
        handleReaderResult(reader.result)
      }
    }
    reader.readAsText(file)
  }

  const csvDataOutput = useMemo(() => {
    let csvDataOutput: { [key: string ]: string }[] = csvData

    if (modifications.includes(Modifications.dateFormat)) {
      csvDataOutput = csvDataOutput.map((rowObj: { [key: string]: string }) => ({
          ...rowObj,
          Fecha: DateTime.fromFormat(rowObj.Fecha, 'd/M/yyyy').toFormat('MM/dd/yyyy'),
        }))
    }

    return csvDataOutput
  }, [csvData,  modifications])

  const outputFilename = `promerica-converted-xls-${DateTime.now().toFormat('MM-dd-yyyy')}`

  return (
    <div className={styles.container}>
      <Head>
        <title>Web Utils</title>
        <meta name="description" content="Promerica '.xls' to .csv converter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Promerica {'".xls"'} to .csv
        </h1>

        <p className={styles.description}>
          Promerica CR outputs a so-called {'".xls"'} format for bank statements. Turns out these morons just output an html file and changed the filename to {'".xls"'}. This tool parses that html and turns the main table into a csv file. Unfortunately, because of the nature of html, this tool will likely break when Promerica makes any changes to their site, since it functions like a scraper (using html selectors).
        </p>

        <DragAndDrop
          onChangeFiles={handleChangeFiles}
          acceptType=".xls"
          filename={filename}
        />
        {error && <Alert>{error}</Alert>}

        {csvData.length > 0 && (
          <div className={styles.twoColumn}>
            <div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={modifications.includes(Modifications.dateFormat)}
                  onChange={e => setModifications(xor(modifications, [Modifications.dateFormat]))}
                  className={styles.checkboxMargin}
                />
                <span>d/M/yyyy <span className="text-muted">-&gt;</span> MM/dd/yyyy</span>
              </label>
            </div>
            <div>
              <CSVLink
                data={csvDataOutput}
                headers={CommonCsvHeaders}
                className={styles.csvLink}
                filename={outputFilename}
                target="_blank"
              >
                Download .csv
              </CSVLink>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home

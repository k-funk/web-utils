import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import { CSVLink } from 'react-csv'
import cheerio from 'cheerio'
const HtmlTableToJson = require('html-table-to-json')

import DragAndDrop from '../components/DragAndDrop'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  const [csvData, setCsvData] = useState<{ [key: string ]: string }[]>([])
  const [filename, setFilename] = useState('')

  function preprocessHtml(fileStr: string) {
    const tableId = 'data-table'
    // add an ID to the table, to use as a selector
    fileStr = fileStr.replace(
      /(\<table)(\ style\=\"width:115%\;\ padding-top\:10px\;\"\>)/,
      (match, g1, g2) => [g1, ` id="${tableId}"`, g2].join('')
    )

    const innerTable = cheerio.load(fileStr)(`#${tableId} table`)
    // change the first row's <td>s into <th>s
    // @ts-ignore
    innerTable.find('tr').first().find('td').each((i: number, item: Element) => item.tagName = 'th')

    // remove second row of table, since it's a statement summary
    const secondRow = innerTable.find('tr:nth-child(2)')
    if (!secondRow.text().includes('Saldo Inicial')) {
      throw new Error('table format changed. Second row was not "Saldo Inicial"')
    }
    secondRow.remove()

    return innerTable.toString()
  }

  function handleReaderResult(fileStr: string) {
    const jsonTables = HtmlTableToJson.parse(preprocessHtml(fileStr))
    if (jsonTables.count !== 1) {
      throw new Error('table format changed. Second row was not "Saldo Inicial"')
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
  }

  function handleChangeFiles(files: File[]) {
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

  const csvDataUSDates = useMemo(() => {
    return csvData.map((rowObj: { [key: string]: string }) => {
      return {
        ...rowObj,
        Fecha: DateTime.fromFormat(rowObj.Fecha, 'd/M/yyyy').toFormat('MM/dd/yyyy'),
      }
    })
  }, [csvData])

  const csvDataGeneralLedger = useMemo(() => {
    return csvData.map((rowObj: { [key: string]: string }) => {
      return {
        ...rowObj,
        Fecha: DateTime.fromFormat(rowObj.Fecha, 'd/M/yyyy').toFormat('MM/dd/yyyy'),
        Credito: Math.sign(Number(rowObj.Monto)) === 1 ? rowObj.Monto : '',
        Debito: Math.sign(Number(rowObj.Monto)) === -1 ? Math.abs(Number(rowObj.Monto)) : '',
      }
    })
  }, [csvData])

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
        {csvData.length > 0 && (
          <div>
            <CSVLink
              data={csvData}
              className={styles.csvLink}
              filename={outputFilename}
              target="_blank"
            >
              Download - No Modifications
            </CSVLink>
            <CSVLink
              data={csvDataUSDates}
              className={styles.csvLink}
              filename={outputFilename}
              target="_blank"
            >
              Download - mm/dd/yyyy
            </CSVLink>
            <CSVLink
              data={csvDataGeneralLedger}
              headers={[
                { label: 'Date', key: 'Fecha'},
                { label: 'Document', key: 'Documento'},
                { label: 'Description', key: 'Descripción'},
                { label: 'Debit', key: 'Debito'},
                { label: 'Credit', key: 'Credito'},
              ]}
              className={styles.csvLink}
              filename={outputFilename}
              target="_blank"
            >
              Download - General Ledger
            </CSVLink>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home

import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useCallback, FormEvent } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import FormInput from '../components/FormInput'
import Button from '../components/Button'

const WhatsAppNumber: NextPage = () => {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')

  // Strip all non-digit characters from input
  const formatPhoneNumber = (input: string): string => {
    return input.replace(/\D/g, '')
  }

  const navigateToWhatsApp = useCallback((input: string) => {
    const digitsOnly = formatPhoneNumber(input)

    if (digitsOnly) {
      // Navigate to WhatsApp URL
      window.location.href = `https://wa.me/${digitsOnly}`
    }
  }, [])

  useEffect(() => {
    // Check if there's an 'input' query parameter
    if (router.isReady && router.query.input) {
      navigateToWhatsApp(router.query.input as string)
    }
  }, [router.isReady, router.query.input, navigateToWhatsApp])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigateToWhatsApp(phoneNumber)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>WhatsApp Number - Web Utils</title>
        <meta name="description" content="WhatsApp Number utility" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          WhatsApp Phone Formatter
        </h1>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <FormInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Enter phone number"
            />
          </div>
          <Button type="submit">
            Open in WhatsApp
          </Button>
        </form>
      </main>
    </div>
  )
}

export default WhatsAppNumber
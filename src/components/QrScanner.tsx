"use client"

import { useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
  isScanning: boolean
}

export function QRScanner({ onScan, onError, isScanning }: QRScannerProps) {
  const qrRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (!isScanning) {
      if (qrRef.current) {
        qrRef.current.clear()
      }
      return
    }

    qrRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    qrRef.current.render(
      (decodedText) => onScan(decodedText),
      (error) => {
        if (onError) onError(error)
      }
    )

    return () => {
      if (qrRef.current) {
        qrRef.current.clear().catch(console.error)
      }
    }
  }, [isScanning, onScan, onError])

  return <div id="qr-reader" className="w-full max-w-sm mx-auto" />
}
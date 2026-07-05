import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import { Download, QrCode } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Student } from '@/types'

interface QRCodeCardProps {
  url: string
  student: Student
}

export function QRCodeCard({ url, student }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 200,
      margin: 2,
      color: { dark: '#2c2825', light: '#fffdf900' },
    }).then(() => setReady(true))
  }, [url])

  const downloadPng = async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 480
    canvas.height = 580
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#fffdf9'
    ctx.fillRect(0, 0, 480, 580)

    ctx.strokeStyle = '#c9a962'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, 440, 540)

    ctx.fillStyle = '#2c2825'
    ctx.font = 'bold 22px IBM Plex Sans Arabic, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('امسح للتهنئة', 240, 60)

    ctx.font = '16px IBM Plex Sans Arabic, sans-serif'
    ctx.fillStyle = '#8a8279'
    ctx.fillText(student.name, 240, 90)

    const qrCanvas = canvasRef.current
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, 140, 120, 200, 200)
    }

    ctx.fillStyle = '#a68b4b'
    ctx.font = '12px monospace'
    ctx.fillText(url.replace('https://', ''), 240, 380)

    ctx.fillStyle = '#c9a962'
    ctx.font = '14px IBM Plex Sans Arabic, sans-serif'
    ctx.fillText('Congrats Platform', 240, 520)

    const link = document.createElement('a')
    link.download = `congrats-${student.nameEn.replace(/\s/g, '-')}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <motion.div
      ref={cardRef}
      className="flex flex-col items-center rounded-2xl border border-luxury-gold/25 bg-white/70 p-6 backdrop-blur-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="mb-4 flex items-center gap-2 text-luxury-gold-dark">
        <QrCode className="h-5 w-5" />
        <span className="editorial-label text-sm">رمز QR</span>
      </div>

      <div className="rounded-xl border border-luxury-gold/20 bg-cream p-4 shadow-inner">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>

      <p className="editorial-body mt-4 text-center text-xs text-muted">
        امسح الرمز للوصول لصفحة التهنئة
      </p>

      <Button
        variant="outline"
        size="sm"
        className="mt-4 gap-2"
        onClick={downloadPng}
        disabled={!ready}
      >
        <Download className="h-4 w-4" />
        تحميل PNG
      </Button>
    </motion.div>
  )
}

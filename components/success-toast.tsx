"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

interface SuccessToastProps {
  message: string
  duration?: number
  onClose?: () => void
}

export function SuccessToast({ message, duration = 3000, onClose }: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-4 text-green-500 hover:text-green-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

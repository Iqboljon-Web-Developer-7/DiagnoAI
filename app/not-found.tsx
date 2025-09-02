'use client'

import Link from "next/link"
import Image from "next/image"
import { Home, ArrowLeft, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(false)
  const [showRetry, setShowRetry] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowRetry(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleRetry = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.reload()
  }

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-[#f1faee] to-[#e9f5e9] flex flex-col">
          <header className="bg-worm-grey backdrop-blur-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-2 group">
                  <Image
                    src="/logo.png"
                    width={128}
                    height={32}
                    alt="Logo"
                    className="transform group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-full p-2 ${showRetry ? 'bg-blue-100' : 'opacity-0'}`}
                  onClick={handleRetry}
                  disabled={!showRetry || isLoading}
                >
                  <RefreshCcw className={`w-5 h-5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </header>

          <main className="flex-grow flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            >
              <Image src={'/404.gif'} width={600} height={600} alt="404 Not Found" className="rounded-xl shadow-lg" />
              <motion.div
                className="flex justify-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/">
                  <Button
                    variant={'outline'}
                    className="transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-400/50 rounded-full"
                  >
                    <Home className="w-6 h-6" />
                    <motion.div
                      animate={{
                        x: [-5, 5, -5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <ArrowLeft className="w-6 h-6 mr-2" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </main>
        </div>

        <style jsx>{`
          .glass-morphism {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
        `}</style>
      </body>
    </html>
  )
}

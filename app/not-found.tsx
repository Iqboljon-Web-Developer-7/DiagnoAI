import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Home, Search, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-2">
                  <Image src="/logo.jpg" width={128} height={32} alt="Logo" />
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-grow flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sahifa topilmadi</h2>
              <p className="text-xl text-gray-600 mb-8">
                Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Home className="w-5 h-5 mr-2" />
                    Bosh sahifaga qaytish
                  </Button>
                </Link>
                <Link href="javascript:history.back()">
                  <Button size="lg" variant="outline">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Orqaga qaytish
                  </Button>
                </Link>
              </div>
            </div>
          </main>

          <footer className="bg-white py-6 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Diagno AI</span>
              </div>
              <p className="text-gray-600">&copy; 2024 Diagno AI. Barcha huquqlar himoyalangan.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

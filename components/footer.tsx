import Link from "next/link"
import { Brain } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Diagno AI</span>
            </div>
            <p className="text-gray-400">Sun'iy intellekt yordamida tibbiy tashxis va shifokor tavsiyalari</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Xizmatlar</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/ai-diagnosis" className="hover:text-white">
                  AI Tashxis
                </Link>
              </li>
              <li>
                <Link href="/emergency-help" className="hover:text-white">
                  Shoshilinch Yordam
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white">
                  Shifokorlar
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="hover:text-white">
                  Konsultatsiya
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kompaniya</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Bog'lanish
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Karyera
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Yordam</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/support" className="hover:text-white">
                  Texnik yordam
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Maxfiylik
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Foydalanish shartlari
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Diagno AI. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  )
}

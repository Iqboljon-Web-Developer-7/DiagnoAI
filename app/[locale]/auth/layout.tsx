import { getTranslations } from "next-intl/server"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const layout = async ({ children }: { children: React.ReactNode, 
  

 }) => {
  const t = await getTranslations("Auth")



  return (
    <div className='grid md:grid-cols-2 relative'>
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 dark:text-gray-200 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-white dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
      >
        <ChevronLeft className="h-4 w-2 scale-[2.22]" />
      </Link>

      <div className='hidden md:block relative bg-cover bg-no-repeat bg-left' style={{backgroundImage: 'url(/auth.jpg)'}}>
        <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>{t("title")}</h1>
          <p className='text-xl text-center'>
            {t("description")}
          </p>
        </div>
      </div>
      <div >
        {children}
      </div>
    </div>
  )
}

export default layout
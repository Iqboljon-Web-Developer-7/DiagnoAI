import { getTranslations } from "next-intl/server"

const layout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("Auth")

  return (
    <div className='grid md:grid-cols-2'>
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
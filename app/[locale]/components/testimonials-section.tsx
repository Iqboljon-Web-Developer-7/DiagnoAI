import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

const EmblaCarousel = dynamic(() => import('@/components/TestimoniolsCarousel/EmblaCarousel'), {
  loading: () => <div className="h-[200px] bg-gray-200 dark:bg-gray-800 animate-pulse">Loading carousel...</div>
});

const testimonialData = [
  { id: 1, imageSrc: 'https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=', fallback: 'AA', content: "DiagnoAI platformasi juda qulay va foydalanish uchun sodda. Bemorlarimiz uchun tezkor diagnostika imkoniyatini beradi.", name: "Abdullayev Aziz", role: "Bosh shifokor, Toshkent Tibbiyot Markazi" },
  { id: 2, imageSrc: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=', fallback: 'MK', content: "Ushbu platforma bizning klinikamizda diagnostika jarayonini sezilarli darajada yaxshiladi.", name: "Madina Karimova", role: "Radiolog, Samarqand Klinikasi" },
  { id: 3, imageSrc: 'https://t4.ftcdn.net/jpg/06/08/55/73/360_F_608557356_ELcD2pwQO9pduTRL30umabzgJoQn5fnd.jpg', fallback: 'SU', content: "Sun'iy intellekt texnologiyasi diagnostika aniqligini oshirishga yordam berdi.", name: "Sardor Umarov", role: "Nevropatolog, Andijon Shifoxonasi" },
  { id: 4, imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuCL295ApqVsX3sk2MH7OwRyxr45z4dZu_JSjZsx5D2z3o1GWzljmhwTHLIgFqdeA-B_E&usqp=CAU', fallback: 'NT', content: "DiagnoAI bilan ishlash juda qulay, natijalar tez va aniq chiqadi.", name: "Nilufar Toshpulatova", role: "Kardiolog, Farg'ona Tibbiyot Markazi" },
  { id: 5, imageSrc: 'https://img.freepik.com/free-photo/portrait-expressive-young-man-wearing-formal-suit_273609-6942.jpg?semt=ais_hybrid&w=740&q=80', fallback: 'BI', content: "Bemorlar diagnostika natijalarini tezroq olishmoqda, bu juda muhim yutuq.", name: "Botir Ismoilov", role: "Bosh shifokor, Buxoro Klinikasi" },
  { id: 6, imageSrc: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg', fallback: 'JT', content: "DiagnoAI platformasi bizning ish samaradorligimizni sezilarli darajada oshirdi.", name: "Jamshid Tursunov", role: "Radiolog, Namangan Klinikasi" },
  { id: 7, imageSrc: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg', fallback: 'ZR', content: "Platformaning eng yaxshi tomoni - bu diagnostika natijalarining yuqori aniqligi.", name: "Zarina Rahimova", role: "Nevrolog, Nukus Tibbiyot Markazi" },
  { id: 8, imageSrc: 'https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg', fallback: 'OR', content: "DiagnoAI platformasi tibbiy xizmat sifatini yangi bosqichga olib chiqdi.", name: "Olim Rahmonov", role: "Bosh shifokor, Qarshi Shifoxonasi" },
  { id: 9, imageSrc: 'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg?t=st=1758286360~exp=1758289960~hmac=2eca3beb3ba73979ad3ad9501ed8867aee210a62e5a2355720b448569084a176&w=1480', fallback: 'SN', content: "Bemorlarning diagnostika natijalarini kutish vaqti sezilarli darajada qisqardi.", name: "Sitora Nazarova", role: "Kardiolog, Xiva Tibbiyot Markazi" },
  { id: 10, imageSrc: 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg', fallback: 'RM', content: "DiagnoAI platformasi zamonaviy tibbiyotning ajralmas qismiga aylandi.", name: "Rustam Mirzayev", role: "Radiolog, Jizzax Klinikasi" }
];
export async function TestimonialsSection() {
  const t = await getTranslations('Index');

  return (
    <section className="py-8">
      <div className="mx-auto px-1">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('testimonials.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {t('testimonials.description')}
          </p>
        </div>
        <EmblaCarousel slides={testimonialData} type='testimonials' />
      </div>
    </section>
  )
}

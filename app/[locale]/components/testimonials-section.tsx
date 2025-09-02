import { getTranslations } from 'next-intl/server';
import EmblaCarousel from '@/components/TestimoniolsCarousel/EmblaCarousel';

const testimonialData = [
  { id: 1, imageSrc: 'https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=', fallback: 'AA', content: "DiagnoAI platformasi juda qulay va foydalanish uchun sodda. Bemorlarimiz uchun tezkor diagnostika imkoniyatini beradi.", name: "Abdullayev Aziz", role: "Bosh shifokor, Toshkent Tibbiyot Markazi" },
  { id: 2, imageSrc: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=', fallback: 'MK', content: "Ushbu platforma bizning klinikamizda diagnostika jarayonini sezilarli darajada yaxshiladi.", name: "Madina Karimova", role: "Radiolog, Samarqand Klinikasi" },
  { id: 3, imageSrc: 'https://t4.ftcdn.net/jpg/06/08/55/73/360_F_608557356_ELcD2pwQO9pduTRL30umabzgJoQn5fnd.jpg', fallback: 'SU', content: "Sun'iy intellekt texnologiyasi diagnostika aniqligini oshirishga yordam berdi.", name: "Sardor Umarov", role: "Nevropatolog, Andijon Shifoxonasi" },
  { id: 4, imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuCL295ApqVsX3sk2MH7OwRyxr45z4dZu_JSjZsx5D2z3o1GWzljmhwTHLIgFqdeA-B_E&usqp=CAU', fallback: 'NT', content: "DiagnoAI bilan ishlash juda qulay, natijalar tez va aniq chiqadi.", name: "Nilufar Toshpulatova", role: "Kardiolog, Farg'ona Tibbiyot Markazi" },
  { id: 5, imageSrc: 'https://img.freepik.com/free-photo/portrait-expressive-young-man-wearing-formal-suit_273609-6942.jpg?semt=ais_hybrid&w=740&q=80', fallback: 'BI', content: "Bemorlar diagnostika natijalarini tezroq olishmoqda, bu juda muhim yutuq.", name: "Botir Ismoilov", role: "Bosh shifokor, Buxoro Klinikasi" },
];
export async function TestimonialsSection() {
  const t = await getTranslations('Index');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {t('testimonials.description')}
          </p>
        </div>
      <EmblaCarousel slides={testimonialData} />
      </div>
    </section>
  )
}
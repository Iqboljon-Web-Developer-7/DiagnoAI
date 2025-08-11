import { getTranslations } from 'next-intl/server';
import EmblaCarousel from '@/components/TestimoniolsCarousel/EmblaCarousel';

const testimonialData = [
  { id: 1, imageSrc: 'https://picsum.photos/100?random=1', fallback: 'JD', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', name: 'John Doe', role: 'CEO, Company A' },
  { id: 2, imageSrc: 'https://picsum.photos/100?random=2', fallback: 'JS', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', name: 'Jane Smith', role: 'CTO, Company B' },
  { id: 3, imageSrc: 'https://picsum.photos/100?random=3', fallback: 'EM', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', name: 'Emily Martin', role: 'Designer, Company C' },
  { id: 4, imageSrc: 'https://picsum.photos/100?random=4', fallback: 'MW', content: 'Duis aute irure dolor in reprehenderit in voluptate velit.', name: 'Michael Wong', role: 'Developer, Company D' },
  { id: 5, imageSrc: 'https://picsum.photos/100?random=5', fallback: 'AL', content: 'Excepteur sint occaecat cupidatat non proident.', name: 'Anna Lee', role: 'Manager, Company E' },
  { id: 6, imageSrc: 'https://picsum.photos/100?random=6', fallback: 'TB', content: 'Sunt in culpa qui officia deserunt mollit anim id est laborum.', name: 'Tom Brown', role: 'Founder, Company F' },
  { id: 7, imageSrc: 'https://picsum.photos/100?random=7', fallback: 'LC', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur.', name: 'Lisa Chen', role: 'Marketing, Company G' },
  { id: 8, imageSrc: 'https://picsum.photos/100?random=8', fallback: 'RG', content: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.', name: 'Robert Garcia', role: 'Analyst, Company H' },
  { id: 9, imageSrc: 'https://picsum.photos/100?random=9', fallback: 'SK', content: 'Consectetur, adipisci velit, sed quia non numquam eius modi.', name: 'Sarah Kim', role: 'Consultant, Company I' },
  { id: 10, imageSrc: 'https://picsum.photos/100?random=10', fallback: 'DP', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.', name: 'David Patel', role: 'Engineer, Company J' },
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
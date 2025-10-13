// app/[locale]/education/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Clock, GraduationCap, Search } from 'lucide-react';
import Image from 'next/image';
import heroImage from '@/assets/images/education/education-hero.jpg';
import { VideoModal } from '../../../../components/shared/VideoModal';

// Define the Video interface
interface Video {
  id: string;
  titleKey: string; // Translation key for title
  descriptionKey: string; // Translation key for description
  videoUrl: string;
  thumbnail: string;
  duration: string;
  categoryKey: string; // Translation key for category
}

// Mock video data with translation keys
const mockVideos: Video[] = [
  {
    id: '1',
    titleKey: '1.title',
    descriptionKey: '1.description',
    videoUrl: 'https://www.youtube.com/embed/uXdGHzguoeA?si=VHuMYeHP2csZPWA4',
    thumbnail: 'https://i.ytimg.com/vi/uXdGHzguoeA/maxresdefault.jpg',
    duration: '45 min',
    categoryKey: 'categories.advertisement',
  },
  {
    id: '2',
    titleKey: '2.title',
    descriptionKey: '2.description',
    videoUrl: 'https://www.youtube.com/embed/6Js5kSVYA1Q?si=NdWAcFQa8gIR3g4D',
    thumbnail:
      'https://i.ytimg.com/vi/6Js5kSVYA1Q/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gMigpMA8=&rs=AOn4CLA59cetPQJpkmzhAWnSe2JulO94zg',
    duration: '32 min',
    categoryKey: 'categories.podcast',
  },
  {
    id: '3',
    titleKey: '3.title',
    descriptionKey: '3.description',
    videoUrl: 'https://www.youtube.com/embed/OTJzNqgQo3Y?si=wkpLyI6OpTGSYIPp',
    thumbnail: 'https://i.ytimg.com/vi/OTJzNqgQo3Y/maxresdefault.jpg',
    duration: '28 min',
    categoryKey: 'categories.advertisement',
  },
  {
    id: '4',
    titleKey: '4.title',
    descriptionKey: '4.description',
    videoUrl: 'https://www.youtube.com/embed/HBJ9O64xUYM?si=dUQAT3h64nPE1-JU',
    thumbnail: 'https://i.ytimg.com/vi/HBJ9O64xUYM/maxresdefault.jpg',
    duration: '52 min',
    categoryKey: 'categories.education',
  },
  {
    id: '5',
    titleKey: '5.title',
    descriptionKey: '5.description',
    videoUrl: 'https://www.youtube.com/embed/bbDdp3z3uTw?si=fGUMfSJ6qdNmhNgG',
    thumbnail: 'https://i.ytimg.com/vi/bbDdp3z3uTw/maxresdefault.jpg',
    duration: '38 min',
    categoryKey: 'categories.explainer',
  },
  {
    id: '6',
    titleKey: '6.title',
    descriptionKey: '6.description',
    videoUrl: 'https://www.youtube.com/embed/OQPaN911LEA?si=6x93e6xDj3NAAskc',
    thumbnail: 'https://i.ytimg.com/vi/OQPaN911LEA/maxresdefault.jpg',
    duration: '41 min',
    categoryKey: 'categories.education',
  },
  {
    id: '7',
    titleKey: '7.title',
    descriptionKey: '7.description',
    videoUrl: 'https://www.youtube.com/embed/OubN6MI9iHY?si=l1KWq9pEgqRZvEWk',
    thumbnail:
      'https://i.ytimg.com/vi/OubN6MI9iHY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDYgYShyMA8=&rs=AOn4CLBdTzaWrEHRLps61gkG6JWqwBdETg',
    duration: '41 min',
    categoryKey: 'categories.using_diagno_ai',
  },
  {
    id: '8',
    titleKey: '8.title',
    descriptionKey: '8.description',
    videoUrl: 'https://www.youtube.com/embed/0GPz8Cy_vnU?si=FqKczA4nnklX1Wif',
    thumbnail:
      'https://i.ytimg.com/vi/OubN6MI9iHY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDYgYShyMA8=&rs=AOn4CLBdTzaWrEHRLps61gkG6JWqwBdETg',
    duration: '41 min',
    categoryKey: 'categories.using_diagno_ai',
  },
];

// Categories with translation keys
const categories = [
  'categories.all',
  'categories.advertisement',
  'categories.podcast',
  'categories.education',
  'categories.explainer',
  'categories.using_diagno_ai',
];

export default function Education() {
  const t = useTranslations('Education'); // Namespace for UI translations
  const tCategories = useTranslations('Categories'); // Namespace for categories
  const tVideos = useTranslations('Videos'); // Namespace for video content
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('categories.all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter videos based on category and search query
  const filteredVideos = mockVideos.filter((video) => {
    const matchesCategory =
      selectedCategory === 'categories.all' || video.categoryKey === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      tVideos(video.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      tVideos(video.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      tCategories(video.categoryKey).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative ">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 bg-black/40 bg-bottom bg-cover bg-no-repeat dark:bg-black/60"
          style={{
            backgroundImage: `url(${heroImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        />
        <div className="relative container mx-auto px-4 py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-down">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary dark:text-accent" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-blue-100 dark:to-primary">
                {t('hero.title')}
              </h1>
            </div>
            <p className="text-xl text-indigo-200 leading-relaxed dark:text-indigo-400">{t('hero.description')}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-200 dark:text-gray-400">
              {/* ... */}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">


        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200"
            >
              {tCategories(category.split('.').pop() as string)}
            </Button>
          ))}
        </div>
        <div className="max-w-md w-full sm:w-auto mb-6 sm:mb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-down"
              onClick={() => handleVideoSelect(video)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    width={1920}
                    height={1080}
                    src={video.thumbnail}
                    alt={tVideos(video.titleKey)}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/90 rounded-full p-4">
                      <Play className="h-6 w-6 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
                    {tCategories(video.categoryKey.split('.').pop() as string)}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {tVideos(video.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {tVideos(video.descriptionKey)}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      {t('watchNow')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <VideoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        video={selectedVideo ? {
          ...selectedVideo,
          title: tVideos(selectedVideo.titleKey),
          description: tVideos(selectedVideo.descriptionKey),
          category: tCategories(selectedVideo.categoryKey)
        } : null}
      />
    </div>
  );
}
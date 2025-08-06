'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Clock, BookOpen, GraduationCap, Search } from "lucide-react";
import { VideoModal } from "../../components/VideoModal";
import heroImage from "@/assets/images/education/education-hero.jpg";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
}

const mockVideos: Video[] = [
  {
    id: "1",
    title: "ProfMedService ko'p tarmoqli klinikasi",
    description: "Siz har doim har bir bemorga katta e'tibor va hurmat bilan munosabatda bo'ladigan klinikani qidirganmisiz? Eng qiyin holatlarda yordam bera oladigan professional shifokorlar va jarrohlar qayerda ishlaydi? 🤕 ProfMedService ko'p tarmoqli klinikasi mutaxassislari allaqachon sizni kutmoqda! To'g'ri shifokor bilan uchrashing va sog'lom bo'ling! 🤗 ☎️ Sizni qiziqtirgan barcha savollar bo'yicha bizning call-markazimizga murojaat qiling: 1️⃣2️⃣1️⃣0️⃣ 🕑Lor shifokorlari qabuli 24/7 ochiq 📍Yunusobod tumani, st. Amira Temura, 119 ____ Har bir bemorga ga'mxo'rlik va hurmat bilan munosabatda bo'lib, eng qiyin vaziyatlarda ham yordam bera iloji boricha foydali va jarroh ishlovchi klinikani izlaysizmi? Kerakli va sal qabuliga yoziling! 🤗 ☎️ Qiziqtirgan barcha savollar bo'yicha qo'ng'iroq markazimizga murojaat qiling: 1️⃣2️⃣1️⃣0️⃣ 🕑LOR hisoblar qabuli 24/7 ochiq 📍Yunusobod tumani, Amir Temur ko'ch, 119",
    videoUrl: "https://www.youtube.com/embed/uXdGHzguoeA?si=VHuMYeHP2csZPWA4",
    thumbnail: "https://i.ytimg.com/vi/uXdGHzguoeA/maxresdefault.jpg",
    duration: "45 min",
    category: "Reklama"
  },
  {
    id: "2", 
    title: "Mutaxassisimiz LOR shifokor Umarov Ravshan Ziyavidinovich",
    description: `Mirkamol Nasirjanovning yangi dasturi mehmoni bo'ldi👨‍⚕️

Gaymorit va uni davolash usullari mavzusiga qiziqasizmi?

 LOR kasalliklari va ularni davolash haqida ko'proq bilishni istaysizmi? 

Unda havola orqali o'ting va ushbu videoni to’liq tomosha qiling✅`,
    videoUrl: "https://www.youtube.com/embed/6Js5kSVYA1Q?si=NdWAcFQa8gIR3g4D",
    thumbnail: "https://i.ytimg.com/vi/6Js5kSVYA1Q/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gMigpMA8=&rs=AOn4CLA59cetPQJpkmzhAWnSe2JulO94zg",
    duration: "32 min",
    category: "Podcast"
  },
  {
    id: "3",
    title: "ProfMedService в Андижане👨‍⚕️",
    description: `
Клиника, вобравшая в себя новейшие технологии и профессиональных врачей, отличается слаженной работой профессиональных врачей. Все заболевания, с высокой точностью диагностируются и лечатся нашими специалистами. Комфортные условия, созданные в клинике, способствуют скорейшему выздоровлению наших пациентов🤗

Телефоны для справок:
📞+99874-228-38-83
📞+99874-228-39-93`,
    videoUrl: "https://www.youtube.com/embed/OTJzNqgQo3Y?si=wkpLyI6OpTGSYIPp",
    thumbnail: "https://i.ytimg.com/vi/OTJzNqgQo3Y/maxresdefault.jpg",
    duration: "28 min",
    category: "Reklama"
  },
  {
    id: "4",
    title: "Yurak kasal ekanligining belgilari!",
    description: `
Agar sizda yoki yaqinlaringizda yurak bilan bog'liq muommolar bo'lsa albatta bizga murojaat qiling. 

Bunda sizga 5 yillik  yillik tajribaga ega kardiolog shifokor Akbar madaliyev yordam beradi. 

☎️+998 (71) 200-23-03
📍manzil: Chilonzor 20\kv`,
    videoUrl: "https://www.youtube.com/embed/HBJ9O64xUYM?si=dUQAT3h64nPE1-JU",
    thumbnail: "https://i.ytimg.com/vi/HBJ9O64xUYM/maxresdefault.jpg",
    duration: "52 min",
    category: "Education"
  },
  {
    id: "5",
    title: "Oshkozon yarasi sababi | kattalik va davolash vositalari",
    description: `Oshqozon yarasi sabablari! ☎️+998 (71) 200-23-03 📍manzil: Chilonzor 20\kv "Bizda halollik foydadan ustun" 🌐Bizni ijtimoiy tarmoqlarda kuzatish ▪️ Instagram:  / hilolmed   
▪️ telegram: https://t.me/HILOLMEDCLINIC 
▪️ tik tok: https: /  hilol_med`,
    videoUrl: "https://www.youtube.com/embed/bbDdp3z3uTw?si=fGUMfSJ6qdNmhNgG",
    thumbnail: "https://i.ytimg.com/vi/bbDdp3z3uTw/maxresdefault.jpg",
    duration: "38 min",
    category: "Explainer"
  },
  {
    id: "6",
    title: "Qandli diabet Belgilari!",
    description: `Qandli diabet Belgilari!

Videoga like bosing va fikringizni, qasi mavzudagi videolar sizni qiziqtirishini yozib qoldiring!

.
Ijtimoiy tarmoqdagi sahifalarimizga obuna bo'ling:
       Instagram: https://instagram.com/drdilshod?igshi...
       Telegram: https://t.me/DrDilshodtursunov
       Facebook:   / drdilshodtur.  .
.
Murojaat uchun: +998 94 651 30 00`,
    videoUrl: "https://www.youtube.com/embed/OQPaN911LEA?si=6x93e6xDj3NAAskc",
    thumbnail: "https://i.ytimg.com/vi/OQPaN911LEA/maxresdefault.jpg",
    duration: "41 min",
    category: "Education"
  },
    {
    id: "7",
    title: "What is Diagno AI? - Overview Presentation",
    description: `This video provides an overview of Diagno AI – an intelligent healthcare assistant platform that leverages AI to support patient diagnostics and analysis. Learn more at @DiagnoAI.`,
    videoUrl: "https://www.youtube.com/embed/OubN6MI9iHY?si=l1KWq9pEgqRZvEWk",
    thumbnail: "https://i.ytimg.com/vi/OubN6MI9iHY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDYgYShyMA8=&rs=AOn4CLBdTzaWrEHRLps61gkG6JWqwBdETg",
    duration: "41 min",
    category: "Using Diagno AI"
  },
      {
    id: "8",
    title:"Diagno AI ilovasi haqida.",
    description: `Tibbiyotda sun'iy intellektni qo'llash asoslari. #diagnoai #O'zbekistondagi birinchi tibbiy sun'iy intellekt​`,
    videoUrl: "https://www.youtube.com/embed/0GPz8Cy_vnU?si=FqKczA4nnklX1Wif",
    thumbnail: "https://i.ytimg.com/vi/OubN6MI9iHY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDYgYShyMA8=&rs=AOn4CLBdTzaWrEHRLps61gkG6JWqwBdETg",
    duration: "41 min",
    category: "Using Diagno AI"
  }
];

const Education = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Reklama", "Podcast", "Education", "Explainer","Using Diagno AI"];

  const filteredVideos = mockVideos.filter(video => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 bg-black/40 bg-bottom bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="relative container mx-auto px-4 py-24 ">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Learn & Grow
              </h1>
            </div>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Master new skills with our comprehensive video library. From fundamentals to advanced concepts, 
              we have everything you need to advance your career.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{mockVideos.length} Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Expert-Led Content</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Video Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card 
              key={video.id} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              onClick={() => handleVideoSelect(video)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/90 rounded-full p-4">
                      <Play className="h-6 w-6 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  <Badge 
                    className="absolute top-3 left-3 bg-primary/90 text-primary-foreground"
                  >
                    {video.category}
                  </Badge>
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {/* <Clock className="h-4 w-4" /> */}
                      {/* <span>{video.duration}</span> */}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Watch Now
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
        video={selectedVideo}
      />
    </div>
  );
};

export default Education;
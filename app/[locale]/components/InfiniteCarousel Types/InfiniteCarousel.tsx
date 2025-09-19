import NeuroMedicine from "@/assets/images/home/infinite-carousel types/neurology.svg"
import Cardiology from "@/assets/images/home/infinite-carousel types/cardiolog.svg"
import Orthopedics from "@/assets/images/home/infinite-carousel types/arthopedic-surgery.svg"
import Pediatrics from "@/assets/images/home/infinite-carousel types/phychiatry.svg"
import Radiology from "@/assets/images/home/infinite-carousel types/nutrition.svg"
import Oncology from "@/assets/images/home/infinite-carousel types/ancology.svg"
import Dermatology from "@/assets/images/home/infinite-carousel types/dermotolog.svg"
import Rheumatology from "@/assets/images/home/infinite-carousel types/rheumatology.svg"

const InfiniteCarousel = () => {
  // all items in correct order
  const slides = [
    { img: NeuroMedicine, title: "Neurology" },
    { img: Cardiology, title: "Cardiology" },
    { img: Orthopedics, title: "Orthopedics" },
    { img: Pediatrics, title: "Pediatrics" },
    { img: Radiology, title: "Radiology" },
    { img: Oncology, title: "Oncology" },
    { img: Dermatology, title: "Dermatology" },
    { img: Rheumatology, title: "Rheumatology" },
  ]

  const trackSlides = [...slides, ...slides, ...slides]

  return (
    <div className="slider2">
      <div className="slide-track">
        {trackSlides.map((item, idx) => (
          <div className="slide" key={idx}>
            <img src={item.img.src} height="70" width="50" alt={item.title} />
            <p className="text-xl">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfiniteCarousel

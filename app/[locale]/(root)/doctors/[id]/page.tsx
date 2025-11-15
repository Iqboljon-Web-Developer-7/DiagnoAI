"use client";

import { Booking } from "../types";
import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  DollarSign,
  Building2,
  Stethoscope,
  User,
  Clock,
  Star,
  Calendar,
  Hospital,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { use } from "react";
import { Circles } from "react-loader-spinner";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAppStore } from "@/store/store";
import {
  useDoctorQuery,
  useFreeTimes,
  useCreateBookingMutation,
  useGetClinicBookings,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} from "../api";
import { BookingDialog } from "../BookingDialog";
import { useSearchParams } from "next/navigation";

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default function page({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const isOpenedInOtherWeb = searchParams.get("isOpenedInOtherWeb");

  useEffect(() => {
    if(isOpenedInOtherWeb == 'true'){
      const showElement = document.querySelector(".showWhenOpenInOtherWeb")
      const hideElements = document.querySelectorAll(".hideWhenOpenInOtherWeb")
      hideElements[0]?.classList.add("hidden")
      hideElements[1]?.classList.add("hidden")
      showElement?.classList.remove("hidden")
    }
  },[isOpenedInOtherWeb])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { id, locale } = resolvedParams;

  const { user } = useAppStore();
  const token = user?.token;
  const role = user?.role;

  const translations = useTranslations("doctors");

  const {
    data: doctor,
    isLoading: loading,
    isPending,
  } = useDoctorQuery(id, token, locale);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const {
    data: freeTimes,
    isLoading: freeTimesLoading,
    refetch: refetchFreeTimes,
  } = useFreeTimes(id, token, formattedDate);

  const createBooking = useCreateBookingMutation(token);
  const { data: clinicBookings, isLoading: clinicBookingsLoading } =
    useGetClinicBookings(token, role === "clinic");
  const updateBooking = useUpdateBookingMutation(locale);
  const deleteBooking = useDeleteBookingMutation(locale);

  const filteredClinicBookings =
    clinicBookings?.filter((b: Booking) => b.doctor === parseInt(id)) || [];

  const handleUpdateStatus = (
    bookingId: number,
    newStatus: Booking["status"]
  ) => {
    updateBooking.mutate(
      { booking_id: bookingId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`${translations("bookingUpdatedTo")} ${newStatus}`);
        },
        onError: () => toast.error(translations("failedToUpdateBooking")),
      }
    );
  };

  const handleDelete = (bookingId: number) => {
    deleteBooking.mutate(
      { booking_id: bookingId },
      {
        onSuccess: () => {
          toast.success(translations("bookingDeleted"));
        },
        onError: () => toast.error(translations("failedToDeleteBooking")),
      }
    );
  };

  const bookedTimes =
    freeTimes?.booked_times?.map((time) => {
      return parseInt(time.split(":")[0]);
    }) ?? [];

  const allTimes: number[] = Array.from({ length: 13 }, (_, i) => i + 8);
  const sortedTimes = allTimes.sort((a, b) => a - b);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleBookAppointment = (time: number) => {
    const hour = time.toString().padStart(2, "0");
    const appointmentDate = `${formattedDate}T${hour}:00:00Z`;
    createBooking.mutate(
      { doctor: parseInt(id), appointment_date: appointmentDate },
      {
        onSuccess: () => {
          toast.success(translations("bookingCreatedSuccessfully"));
          refetchFreeTimes();
        },
        onError: () => toast.error(translations("failedToCreateBooking")),
      }
    );
  };

  // Doctors' descriptions object
const doctors = {
  'Gastroenterolog': 'hazm qilish tizimining barcha a’zolari: oshqozon, ichaklar, jigar, o‘t pufagi va o‘t yo‘llaridagi yallig‘lanish, yara, tosh, dispepsiya, jigar yog‘lanishi, pankreatit kabi kasalliklarni endoskopik va laborator tahlillar asosida aniqlab, dori-darmon, parhez va zamonaviy muolajalar bilan davolovchi mutaxassis.',
  'Gastroenterologist': 'hazm qilish tizimining barcha a’zolari: oshqozon, ichaklar, jigar, o‘t pufagi va o‘t yo‘llaridagi yallig‘lanish, yara, tosh, dispepsiya, jigar yog‘lanishi, pankreatit kabi kasalliklarni endoskopik va laborator tahlillar asosida aniqlab, dori-darmon, parhez va zamonaviy muolajalar bilan davolovchi mutaxassis.',
  
  'Nevropatolog': 'miya, orqa miya, periferik nervlar va butun asab tizimidagi buzilishlarni EKG, MRT, KT, nevrologik tekshiruvlar orqali aniqlab, bosh og‘rig‘i, migren, insult, epilepsiya, radikulit, nerv qisilishi, uvishish, koordinatsiya buzilishi kabi kasalliklarni dori terapiyasi va reabilitatsiya usullari bilan davolovchi mutaxassis.',
  
  'Laboratoriya': 'bemordan olingan qon, siydik, tupuk va boshqa biologik namunalarni zamonaviy laborator uskunalar orqali tahlil qilib, infeksiya, yallig‘lanish, gormonal buzilish, metabolik o‘zgarishlar, vitamin-mineral yetishmovchiligi va boshqa kasallik belgilarini aniqlab, shifokorlarga aniq tashxis qo‘yishda asosiy ma’lumotni taqdim etuvchi mutaxassis.',
  
  'UZI': 'jigar, buyrak, yurak, qalqonsimon bez, qorin bo‘shlig‘i, tos a’zolari va homiladorlik holatini ultratovush yordamida real vaqt rejimida ko‘rib, o‘sma, yallig‘lanish, tosh, kista, rivojlanish nuqsonlari va boshqa patologiyalarni erta bosqichda aniqlab, shifokorlarga aniq tashxis qo‘yishda muhim ma’lumot beruvchi mutaxassis.',
  
  'Travmatolog-ortoped': 'suyak, bo‘g‘im, mushak va umurtqa tizimidagi jarohatlar hamda tug‘ma yoki orttirilgan ortopedik kasalliklarni klinik tekshiruv, rentgen, MRT va KT asosida aniqlab, sinish, chiqish, yoriq, mushak-pay cho‘zilishi, artroz, artrit, skolioz, sport jarohatlari va bo‘g‘im og‘riqlarini dori, reabilitatsiya yoki jarrohlik usullari bilan davolovchi mutaxassis.',
  
  'Yurak jarrohi': 'yurakning tug‘ma yoki orttirilgan kasalliklarini ochiq yoki minimal invaziv jarrohlik usullari orqali davolaydigan mutaxassis bo‘lib, yurak klapanlarini almashtirish yoki rekonstruksiya qilish, yurak qon tomirlariga bypass qo‘yish, yurak devorlari va tuzilmasidagi nuqsonlarni tuzatish, ritm buzilishlariga sabab bo‘ladigan anatomik o‘zgarishlarni bartaraf etish kabi murakkab operatsiyalarni bajaradi.',
  
  'Qon tomir jarrohi': 'tanadagi arteriya va vena tomirlarida yuzaga keladigan torayish, tiqilish, anevrizma, varikoz, tromboz kabi patologiyalarni ultratovush, KT-angiografiya va boshqa tasviriy usullar asosida aniqlab, tomirni kengaytirish, protezlash, shuntlash, varikoz venalarni olib tashlash yoki lazer orqali yopish kabi jarrohlik va minimal invaziv muolajalar bilan davolovchi mutaxassis.',
  
  'Flebolog': 'oyoq venalarida kuzatiladigan varikoz kengayishi, tromboz, vena yetishmovchiligi, shish, og‘riq va tomirning tashqariga chiqishi kabi buzilishlarni Doppler-UZI, flebografiya va klinik ko‘rik asosida aniqlab, skleroterapiya, lazer yoki radiochastota ablatsiyasi, kompressiya terapiyasi va boshqa zamonaviy minimal invaziv usullar yordamida davolovchi mutaxassis.',
  
  'Intervensiyon kardiolog': 'yurak va qon tomirlarining torayishi, tiqilishi, qon aylanishi buzilishi yoki yurak ritmi bilan bog‘liq muammolarni operatsiyasiz, maxsus kateterlar orqali bajariladigan koronar angiografiya, stentlash, angioplastika va kateter ablatsiyasi kabi minimal invaziv usullar bilan davolaydigan mutaxassis bo‘lib, infarkt paytida tomirni zudlik bilan ochish, oyoq-qo‘l arteriyalaridagi torayishni kengaytirish va yurak ritmini to‘g‘rilashda samarali aralashuvlarni amalga oshiradi.',
  
  'Endokrinolog': 'organizmdagi gormonlar, qalqonsimon bez, qand almashinuvi, ichki sekretsiya bezlari va metabolik jarayonlar faoliyatida yuzaga keladigan buzilishlarni laborator tahlillar, UZI, gormon testlari va klinik belgilar asosida aniqlab, diabet, qalqonsimon bez kasalliklari, gormonal nomutanosiblik, semirish yoki ozib ketish, o‘sish va rivojlanish buzilishlari hamda metabolik sindrom kabi kasalliklarni dori-darmon, parhez va hayot tarzi o‘zgarishlari orqali davolovchi mutaxassis.',
  
  'Nefrolog': 'buyraklarning filtratsiya, suyuqlik-balans va chiqarish funksiyalarida yuzaga keladigan buzilishlarni klinik ko‘rik, siydik-tahlil, qon biokimyosi, UZI va boshqa diagnostik usullar orqali aniqlab, buyrak yallig‘lanishi, toshlar, buyrak yetishmovchiligi, shishlar, siydikda oqsil yoki qon paydo bo‘lishi, hamda buyrak bilan bog‘liq qon bosimi o‘zgarishlarini dori-darmon, parhez va individual davolash rejasi orqali bartaraf etuvchi mutaxassis.',
  
  'Umumiy jarroh': 'qorin bo‘shlig‘i a’zolari va yumshoq to‘qimalarda uchraydigan kasalliklarni klinik ko‘rik, tasviriy tekshiruvlar (UZI, KT, MRT) va laborator tahlillar asosida aniqlab, appenditsit, o‘t pufagi toshlari, yo‘g‘on va ingichka ichak kasalliklari, churralar (grija), teri osti o‘smalari va yiringli jarayonlarni ochiq yoki laparoskopik (teshik orqali) jarrohlik usullari bilan davolaydigan mutaxassis.',
  
  'Kardiolog': 'yurak va qon aylanish tizimidagi funksional buzilishlarni EKG, UTT, Xolter monitoring, laborator tahlillar va tasviriy diagnostika asosida aniqlab, aritmiya, qon bosimi o‘zgarishlari, yurak yetishmovchiligi, stenokardiya, yurak og‘rig‘i, xolesterin oshishi, tomirlarning torayishi kabi kasalliklarni dori-darmon, hayot tarzi o‘zgarishi va profilaktik muolajalar orqali davolovchi mutaxassis.',
  
  'Gepatolog': 'jigar, o‘t yo‘llari va o‘t pufagi faoliyatida yuzaga keladigan yallig‘lanish, tosh, o‘sma va metabolik buzilishlarni klinik ko‘rik, laborator tahlillar (jigar fermentlari), elastografiya, UZI va boshqa tasviriy tekshiruvlar orqali aniqlab, gepatitlar (A, B, C), jigar yog‘lanishi, sirroz, o‘t pufagi toshlari, o‘t yo‘llari yallig‘lanishi hamda jigar almashinuviga oid kasalliklarni dori, parhez va kompleks davolash usullari bilan bartaraf etuvchi mutaxassis.',
  
  'Nevrolog': 'miya, orqa miya, periferik nervlar va butun asab tizimidagi funksional va organik buzilishlarni klinik nevrologik ko‘rik, MRT, KT, ENMG va laborator tahlillar asosida aniqlab, bosh og‘rig‘i, migren, bosh aylanishi, uyqu buzilishi, insult va uning oqibatlari, epilepsiya, radikulit, nerv qisilishi, qo‘l-oyoqlarda uvishish va titrash kabi kasalliklarni dori-darmon, reabilitatsiya va neyroterapiya usullari bilan davolovchi mutaxassis.',
  
  'Bolalar travmatologi': 'o‘sish davridagi bolalarda uchraydigan suyak sinishi, chiqish, lat yeyish, mushak-pay cho‘zilishi va boshqa travmatik shikastlanishlarni rentgen, UZI va klinik tekshiruv asosida aniqlab, bolalar suyaklari o‘sish zonalarini hisobga olgan holda, jarohatlarni xavfsiz va to‘g‘ri tiklash, immobilizatsiya, reabilitatsiya yoki zarur bo‘lsa jarrohlik usullari bilan davolovchi mutaxassis.',
  
  'Bolalar ortopedi': 'bolalarda tug‘ma yoki o‘sish jarayonida shakllanadigan suyak, bo‘g‘im, umurtqa va tayanch-harakat tizimiga oid nuqsonlarni rentgen, MRT, UZI va klinik tekshiruv asosida aniqlab, skolioz, yassi tovonglik, oyoq-qo‘l o‘sishidagi buzilishlar, yurishdagi o‘zgarishlar, tug‘ma deformatsiyalar va boshqa ortopedik kasalliklarni dori, ortopedik vositalar, reabilitatsiya yoki jarrohlik muolajalari bilan davolovchi mutaxassis.',
  
  'Reanimatolog': 'hayot uchun xavfli bo‘lgan og‘ir holatlardagi bemorlarni intensiv kuzatuv va zamonaviy reanimatsion texnologiyalar yordamida stabilizatsiya qiluvchi mutaxassis bo‘lib, nafas olish va qon aylanishi yetishmovchiligi, yurak urishi buzilishi, ongning o‘zgarishi, koma va shok holatlarini aniqlab, sun’iy nafas oldirish, yurak faoliyatini qo‘llab turish, suyuqlik terapiyasi, dori infuziyalari va reanimatsion muolajalar orqali bemorning hayotiy funksiyalarini tiklaydi va saqlab qoladi.',
  
  'Aritmolog': 'yurakning elektr impulslari va ritm boshqaruviga ta’sir qiluvchi funksional buzilishlarni EKG, Xolter monitoring, elektrofiziologik tadqiqotlar va boshqa diagnostika usullari orqali aniqlab, yurakning tez urishi (taxikardiya), sekin urishi (bradikardiya), notekis urishi (aritmiya) yoki yurak urishining “to‘xtab qolishi”ga o‘xshash ritm buzilishlarini dori-darmonlar, kardioverter-defibrillyatorlar, elektrostimulyatorlar yoki kateter ablatsiyasi kabi zamonaviy usullar bilan davolovchi tor ixtisoslikdagi kardiolog-mutaxassis.',
  
  'Androlog-urolog': 'erkaklar reproduktiv tizimi va siydik yo‘llarida uchraydigan funksional, yallig‘lanishli va gormonal buzilishlarni klinik ko‘rik, UZI, laborator tahlillar, gormon testlari va tasviriy diagnostika asosida aniqlab, prostatit va prostata adenomasini, erektil disfunktsiya va bepushtlikni, buyrak va siydik pufagi kasalliklarini, siydik yo‘llari toshlari va infeksiyalarini dori-darmon, fizioterapiya, minimal invaziv muolajalar yoki zarur bo‘lganda jarrohlik aralashuvlari orqali davolovchi mutaxassis.',
  
  'Ko‘krak qafasi jarrohi': 'o‘pka, plevra, qizilo‘ngach, mediastinum va ko‘krak qafasi ichidagi boshqa hayotiy organlarda uchraydigan o‘sma, yallig‘lanish, plevra suvi to‘planishi, o‘pkaning qisqarishi, qizilo‘ngach strikturasi va jarohatlar kabi patologiyalarni KT, MRT, bronxoskopiya va boshqa tasviriy tekshiruvlar asosida aniqlab, ularni ochiq yoki torakoskopik (VATS) jarrohlik usullari bilan davolaydigan mutaxassis.',
  
  'Yurak-qon tomir jarrohi': 'yurak va katta qon tomirlarida uchraydigan tuzilma va qon aylanishi bilan bog‘liq og‘ir patologiyalarni UTT, KT-angiografiya, MRT va klinik baholash asosida aniqlab, yurak klapanlarini almashtirish yoki rekonstruksiya qilish, koronar qon tomirlariga bypass operatsiyasi, aorta kengayishi va anevrizmalarini jarrohlik yo‘li bilan bartaraf etish, tug‘ma yurak nuqsonlarini tuzatish kabi murakkab kardiovaskulyar aralashuvlarni ochiq yoki minimal invaziv usullarda amalga oshiradigan yuqori ixtisoslashgan jarroh-mutaxassis.',
  
  'Radiolog': 'rentgen, KT (kompyuter tomografiya), MRT (magnit-rezonans tomografiya), mammografiya va boshqa tasviriy diagnostika usullari yordamida o‘pka, miya, suyaklar, ichki a’zolar, o‘sma va yallig‘lanish jarayonlari, shikastlanishlar hamda infeksiyalarni tasvirlar orqali aniqlab, ularning tuzilishi, o‘lchami va tarqalishini tahlil qilib, boshqa shifokorlar uchun aniq tashxis qo‘yishda asosiy diagnostik xulosa beruvchi mutaxassis.',
  
  'Terapevt': 'kattalarda uchraydigan ichki a’zolar kasalliklarini klinik ko‘rik, laborator tahlillar, UZI va boshqa tekshiruvlar asosida aniqlab, shamollash va gripp, qand va qon bosimi o‘zgarishlari, xolesterin balandligi, yurak-qon aylanishidagi yengil muammolar, oshqozon-ichak shikoyatlari, allergiya va yengil yallig‘lanish holatlarini dori-darmon, parhez va profilaktik tavsiyalar orqali davolaydigan birlamchi tibbiy yordam ko‘rsatuvchi umumiy amaliyot shifokori.',
  
  'Endoskopist': 'oshqozon-ichak tizimi va ichki bo‘shliqlardagi o‘zgarishlarni maxsus optik moslama — endoskop orqali ko‘rib tekshiradigan, zarur hollarda davolovchi aralashuvlarni ham bajaradigan mutaxassis bo‘lib, gastroskopiya yordamida qizilo‘ngach, oshqozon va o‘n ikki barmoqli ichakni, kolonoskopiya orqali yo‘g‘on ichakni ko‘zdan kechiradi, yara, polip, yallig‘lanish va o‘sma kabi patologiyalarni aniqlaydi hamda polipni olib tashlash, qon ketishini to‘xtatish kabi minimal invaziv muolajalarni amalga oshiradi.',
  
  'Pediatr': 'yangi tug‘ilgan chaqaloqlardan boshlab 18 yoshgacha bo‘lgan bolalarning umumiy salomatligi, o‘sishi va rivojlanishini klinik ko‘rik, laborator tahlillar va funksional tekshiruvlar asosida baholab, shamollash va isitma, oshqozon-ichak muammolari, allergik reaksiyalar, o‘sish va rivojlanish buzilishlari, bolalarga xos infeksiyalar hamda immun tizimiga oid kasalliklarni dori-darmon, parhez, profilaktika va individual davolash rejasi yordamida bartaraf etuvchi bolalar shifokori.',
  
  'LOR': 'quloq, burun va tomoq sohasidagi kasalliklarni klinik ko‘rik, endoskopiya, audiometriya, rentgen yoki KT yordamida aniqlab, shamollash, angina va tonzillit, quloq og‘rig‘i va eshitish pasayishi, burun bitishi, sinusit va allergik rinit, baland ovoz va tomoq og‘rig‘i, shuningdek quloq–burun–tomoqdagi yallig‘lanishlar va infeksiyalarni dori-darmon, jarrohlik yoki zamonaviy muolajalar orqali davolaydigan mutaxassis.',
  
  'Pulmonolog': 'o‘pka va nafas olish tizimida yuzaga keladigan yallig‘lanish, infeksiya, allergik va surunkali kasalliklarni nafas funksiyasi testi, rentgen, KT, spirometriya va klinik ko‘rik asosida aniqlab, astma, bronxit, pnevmoniya, o‘pka infeksiyalari, nafas qisishi, allergik nafas buzilishlari hamda surunkali obstruktiv o‘pka kasalliklari (O‘O‘K)ni dori-darmon, inhalyatsiya, fizioterapiya va profilaktik muolajalar yordamida davolaydigan mutaxassis.',
  
  'Endovaskulyar jarroh': 'arteriya va vena tomirlaridagi torayish, tiqilish, kengayish yoki qon oqimining buzilishi kabi patologiyalarni rentgen nazorati ostida maxsus kateterlar orqali, katta kesishlarsiz bajariladigan minimal invaziv usullar bilan davolaydigan mutaxassis bo‘lib, angioplastika yordamida toraygan tomirlarni kengaytiradi, stent qo‘yadi, varikoz venalarni lazer yoki radiochastota bilan yopadi, tromblarni eritadi yoki olib tashlaydi, shuningdek aorta va boshqa katta tomirlardagi jiddiy kasalliklarni xavfsiz, kam shikastli texnikalar bilan bartaraf etadi.',
  
  'Reabilitolog-fizioterapevt': 'jarohat, operatsiya, insult, tayanch-harakat yoki asab tizimi kasalliklari natijasida yo‘qolgan funksiyalarni tiklashga ixtisoslashgan mutaxassis bo‘lib, elektr, lazer, magnit, ultratovush kabi fizioterapiya muolajalari, terapevtik mashqlar (LFK), mushak va bo‘g‘imlarni kuchaytirish, og‘riqni kamaytirish hamda bemorning harakatini qayta tiklash va mustahkamlashga qaratilgan individual reabilitatsiya dasturlari orqali sog‘lom faoliyatni qayta tiklaydi.',
  
  'Ehokardiografist': 'yurak tuzilmasi va faoliyatini ultratovush (ECHO/UTT) yordamida tasvirlash orqali baholaydigan mutaxassis bo‘lib, yurak klapanlarining ishlashi, yurak mushaklarining qisqaruvchanligi, yurak kameralarining kattaligi, qon oqimining yo‘nalishi va tezligi, shuningdek tug‘ma yoki orttirilgan yurak nuqsonlarini aniqlab, kardialogik tashxis qo‘yishda muhim ma’lumot taqdim etadi.',
  
  'Ginekolog': 'ayollar reproduktiv tizimi, gormonal balans va jinsiy salomatligiga oid kasalliklarni klinik ko‘rik, UZI, gormon tahlillari, sitologik va mikrobiologik tekshiruvlar orqali aniqlab, hayz buzilishlari, tuxumdon va bachadon kasalliklari, gormonal nomutanosiblik, homiladorlikka tayyorgarlik va homiladorlik nazorati, reproduktiv tizimdagi yallig‘lanish va infeksiyalar hamda bepushtlik muammolarini dori-darmon, parhez, gormon terapiyasi yoki zarur hollarda jarrohlik usullari bilan davolaydigan mutaxassis.',
  
  'Kattalar revmatologi': 'kattalarda bo‘g‘im, mushak, pay va butun immun tizimida yuzaga keladigan surunkali yallig‘lanishli va autoimmun kasalliklarni klinik ko‘rik, laborator tahlillar, rentgen, UTT, KT/MRT asosida aniqlab, artrit va artroz, revmatoid artrit, podagra, lupus, vaskulit va boshqa autoimmun kasalliklarni dori-darmon, yallig‘lanishga qarshi preparatlar, immunomodulyatorlar va reabilitatsiya usullari orqali davolaydigan mutaxassis.',
  
  'Bolalar revmatologi': 'bolalarda bo‘g‘im, mushak, pay va immun tizimida uchraydigan yallig‘lanishli va autoimmun kasalliklarni pediatrik ko‘rik, laborator tahlillar, rentgen, UZI va MRT asosida aniqlab, bolalar artriti, o‘sish davridagi bo‘g‘im og‘riqlari, autoimmun kasalliklar, teri-to‘qima kasalliklari va turli revmatik buzilishlarni yoshga mos, xavfsiz dori-darmonlar, fizioterapiya va uzoq muddatli boshqaruv choralarini qo‘llagan holda davolaydigan mutaxassis.',
  
  'Kattalar onkologi': 'kattalarda uchraydigan barcha turdagi yaxshi va yomon sifatli o‘smalar hamda saraton kasalliklarini klinik ko‘rik, biopsiya, KT/MRT, PET-KT, laborator onkomarkerlar va boshqa diagnostik usullar orqali aniqlab, kasallik bosqichi va tarqalishiga qarab kimyoterapiya, immunoterapiya, maqsadli (target) davolash, gormon terapiyasi yoki kompleks onkologik muolajalar yordamida davolaydigan ixtisoslashgan mutaxassis.',
  
  'Bolalar onkologi': 'chaqaloqdan 18 yoshgacha bo‘lgan bolalardagi yaxshi va yomon sifatli o‘smalar hamda saraton kasalliklarini pediatrik ko‘rik, laborator tahlillar, biopsiya, KT/MRT, UTT va boshqa diagnostik usullar yordamida aniqlab, bolalarga xos leykemiya, limfoma, miya o‘smalari, suyak o‘smalari va boshqa onkologik kasalliklarni yoshga mos kimyoterapiya, immunoterapiya, maqsadli davolash va kompleks muolajalar orqali davolaydigan mutaxassis.',
  
  'Onko-mammolog': 'ayollarda uchraydigan ko‘krak bezi kasalliklari, shu jumladan ko‘krak saratonini klinik ko‘rik, mammografiya, UZI, biopsiya va boshqa tasviriy hamda laborator tekshiruvlar yordamida erta bosqichda aniqlab, o‘smaning turi va bosqichiga qarab dori-darmon, maqsadli davolash, immunoterapiya, jarrohlik yoki kombinatsiyalangan onkologik muolajalar bo‘yicha individual davolash rejasini belgilaydigan mutaxassis.',
  
  'Kattalar travmatolog-ortopedi': 'kattalarda uchraydigan suyak, bo‘g‘im, mushak, pay va umurtqa tizimidagi jarohatlar hamda ortopedik kasalliklarni klinik ko‘rik, rentgen, MRT, KT va UZI asosida aniqlab, suyak sinishi, chiqishi va yoriqlar, sport jarohatlari, bo‘g‘im og‘riqlari va artroz, umurtqa qiyshayishi va nerv qisilishi, tizza va son bo‘g‘imlariga protez qo‘yish, pay cho‘zilishi va mushak shikastlanishlarini dori-darmon, reabilitatsiya, ortopedik moslamalar yoki zarur hollarda jarrohlik usullari bilan davolovchi mutaxassis.'
};

function getDoctorInfo(key:string) {
  return (doctors as Record<string, string>)[key]
}

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200 dark:bg-slate-900">
        <div className="flex items-center justify-center p-10 mt-10">
          <Circles
            height="80"
            width="80"
            color="#2563eb"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      </div>
    );
  }

  if (doctor == null) {
    toast.error(translations("doctorNotFound"));
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {translations("doctorNotFound")}
          </h2>
          <Link
            href="/doctors"
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            <Hospital />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 pt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white dark:bg-slate-700 p-1 shadow-2xl">
                  <Image
                    width={400}
                    height={400}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${doctor.image}`}
                    alt={doctor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                  <div className="w-3 h-3 bg-white dark:bg-slate-900 rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {doctor.name}
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-blue-200 dark:text-blue-300" />
                  <span className="text-xl text-blue-200 dark:text-blue-300">
                    {doctor.translations.field}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-200 dark:text-blue-300" />
                  <span className="text-blue-200 dark:text-blue-300">
                    {doctor.hospital.name}
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-blue-200 dark:text-blue-300 ml-2">
                    4.9 (127 {translations("reviews")})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  {user?.role === "client" && (
                    <>
                      <div
                        onClick={() => setIsDialogOpen(true)}
                        className="mx-auto shrink-0 md:mx-0 relative overflow-hidden bg-linear-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 hover:from-blue-700 hover:to-green-700 dark:hover:from-blue-800 dark:hover:to-green-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-green-700 to-green-700 dark:from-green-800 dark:to-green-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-1 sm:gap-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">
                            {translations("doctorCard.bookButton") ||
                              "Book Appointment"}
                          </span>
                        </div>
                        <div className="absolute inset-0 -top-full bg-linear-to-b from-transparent via-white/20 dark:via-gray-900/20 to-transparent group-hover/btn:top-full transition-all duration-700" />
                      </div>
                    </>
                  )}
                  {doctor.hospital.phone_number && (
                    <Link
                      href={`tel:${doctor.hospital.phone_number}`}
                      className="border-2 border-white dark:border-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 dark:hover:bg-blue-700 dark:hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-5 w-5" />
                      <span>{translations("callNow")}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>
                  {translations("aboutDoctor")} {doctor.name}
                </span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {doctor.translations.description}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>{translations("specialization")}</span>
              </h2>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-700">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-lg">
                  {doctor.translations.field}
                </h3>
                <p className="text-blue-800 dark:text-blue-400 mt-1">
                  {getDoctorInfo(doctor.translations.field)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {translations("servicesOffered")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {doctor.hospital.departments.map((service) => (
                  <div
                    key={service}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {role === "client" && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span>
                    {translations("availableTimeSlotsWithDate")} (
                    {selectedDate.toLocaleDateString()})
                  </span>
                </h2>
                <div className="mb-4 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="date"
                    value={formattedDate}
                    onChange={handleDateChange}
                    className="border rounded p-2 dark:bg-slate-700 dark:text-gray-100"
                  />
                </div>
                {freeTimesLoading ? (
                  <p className="dark:text-gray-400">Loading times...</p>
                ) : sortedTimes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sortedTimes.map((time: number) => (
                      <button
                        key={time}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          bookedTimes.includes(time)
                            ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed text-gray-600 dark:text-gray-400"
                            : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                        }`}
                        onClick={() =>
                          !bookedTimes.includes(time) &&
                          handleBookAppointment(time)
                        }
                      >
                        {time.toString().padStart(2, "0")}:00{" "}
                        {bookedTimes.includes(time)
                          ? "- " + translations("booked")
                          : "- " + translations("book")}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {translations("noAvailableSlots")}
                  </p>
                )}
              </div>
            )}

            {role === "clinic" && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span>
                    {translations("bookingsForDoctor")} {doctor.name}
                  </span>
                </h2>
                {clinicBookingsLoading ? (
                  <p className="dark:text-gray-400">
                    {translations("loadingBookings")}
                  </p>
                ) : filteredClinicBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredClinicBookings.map((booking: Booking) => (
                      <div
                        key={booking.id}
                        className="border p-4 rounded-lg dark:border-slate-700"
                      >
                        <p className="dark:text-gray-300">
                          <strong>{translations("id")}</strong> {booking.id}
                        </p>
                        <p className="dark:text-gray-300">
                          <strong>{translations("user")}</strong> {booking.user}
                        </p>
                        <p className="dark:text-gray-300">
                          <strong>{translations("date")}</strong>{" "}
                          {new Date(booking.appointment_date).toLocaleString()}
                        </p>
                        <p className="dark:text-gray-300">
                          <strong>{translations("status")}</strong>{" "}
                          {booking.status}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          {booking.status === "pending" && (
                            <>
                              <button
                                className="bg-green-500 dark:bg-green-700 text-white px-3 py-1 rounded"
                                onClick={() =>
                                  handleUpdateStatus(booking.id, "confirmed")
                                }
                              >
                                {translations("confirm")}
                              </button>
                              <button
                                className="bg-yellow-500 dark:bg-yellow-700 text-white px-3 py-1 rounded"
                                onClick={() =>
                                  handleUpdateStatus(booking.id, "cancelled")
                                }
                              >
                                {translations("cancel")}
                              </button>
                            </>
                          )}
                          <button
                            className="bg-red-500 dark:bg-red-700 text-white px-3 py-1 rounded"
                            onClick={() => handleDelete(booking.id)}
                          >
                            {translations("delete")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {translations("noBookings")}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span>{translations("consultationFee")}</span>
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {doctor.prize}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {translations("perConsultation")}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {translations("contactInformation")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {translations("hospital")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {doctor.hospital.name}
                    </p>
                  </div>
                </div>

                {doctor.hospital.phone_number && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {translations("phone")}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {doctor.hospital.phone_number}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {translations("location")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {doctor.hospital.latitude}, {doctor.hospital.longitude}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Tashkent, Uzbekistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>{translations("workingHours")}</span>
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {translations("mondayFriday")}
                  </span>
                  <span className="font-medium dark:text-gray-100">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {translations("saturday")}
                  </span>
                  <span className="font-medium dark:text-gray-100">
                    9:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {translations("sunday")}
                  </span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {translations("closed")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        doctor={doctor}
        user={user!}
      />
    </div>
  );
}

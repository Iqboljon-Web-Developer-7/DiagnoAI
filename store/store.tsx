import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  token?:string;
  role?:string;
};


type Diagnosis = {
  id: string;
  date: string;
  diagnosis: string;
  confidence: number;
  status: string;
  doctor: string;
};

type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: string;
};

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  latitude: number;
  longitude: number;
  diagnoses: Diagnosis[];
  appointments: Appointment[];
  setLocation: (latitude: number, longitude: number) => void;
  logout: () => void;
  addDiagnosis: (diagnosis: Omit<Diagnosis, "id" | "date">) => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  setUser: (user: User) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      latitude: 0,
      longitude: 0,
      diagnoses: [
        {
          id: "1",
          date: "2024-01-15",
          diagnosis: "Viral Infeksiya (ARVI)",
          confidence: 87,
          status: "Tugallangan",
          doctor: "Dr. Aziza Karimova",
        },
        {
          id: "2",
          date: "2024-01-10",
          diagnosis: "Migren",
          confidence: 92,
          status: "Shifokor bilan uchrashildi",
          doctor: "Dr. Bobur Toshmatov",
        },
        {
          id: "3",
          date: "2024-01-05",
          diagnosis: "Allergik rinit",
          confidence: 78,
          status: "Davolanish davom etmoqda",
          doctor: "Dr. Malika Rahimova",
        },
      ],
      appointments: [
        {
          id: "1",
          doctor: "Dr. Aziza Karimova",
          specialty: "Terapevt",
          date: "2024-01-20",
          time: "14:00",
          type: "Onlayn konsultatsiya",
          status: "Tasdiqlangan",
        },
        {
          id: "2",
          doctor: "Dr. Anvar Usmonov",
          specialty: "Nevropatolog",
          date: "2024-01-25",
          time: "10:30",
          type: "Klinikada uchrashish",
          status: "Kutilmoqda",
        },
      ],
      logout: () => set({ user: null, isLoggedIn: false }),
      addDiagnosis: (diagnosis) => {
        const newDiagnosis = {
          ...diagnosis,
          id: `diagnosis-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          diagnoses: [newDiagnosis, ...state.diagnoses],
        }));
      },
      addAppointment: (appointment) => {
        const newAppointment = {
          ...appointment,
          id: `appointment-${Date.now()}`,
        };
        set((state) => ({
          appointments: [newAppointment, ...state.appointments],
        }));
      },
      setLocation: (latitude, longitude) => set({ latitude, longitude }),
      setUser: (user) => set({ user, isLoggedIn: true }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);
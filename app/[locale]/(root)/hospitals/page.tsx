import ClientHospitalsPage from "./ClientHospitalPage"
import { serverFetch } from "@/app/actions"


// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL


export default async function HospitalsPage() {
  const hospitals = await serverFetch(`/api/hospitals`)

  return (
    <ClientHospitalsPage hospitals={hospitals} />
  )
}
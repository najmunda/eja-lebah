import { Frown } from "lucide-react"

export default function Fallback({ error, resetErrorBoundary }) {
  return (
    <main className="px-2 flex-1 flex flex-col items-center justify-center gap-4">
        <Frown size={100} />
        <p>Galat terjadi, kunjungi lagi lain hari.</p>
    </main>
  )
}
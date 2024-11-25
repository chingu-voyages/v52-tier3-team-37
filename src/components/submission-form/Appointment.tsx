'use client'

import { useRouter } from "next/navigation"

export function Appointment() {
  const router = useRouter()
 
  return (
    <div className="flex flex-col w-full h-60 px-28">
      <div className="flex font-bold flex-col gap-5 w-auto px-28 rounded-2xl bg-yellow-400 py-12 justify-center items-center">
        <p className="text-center text-stone-800 text-3xl">
          Tell us your goals to save money and energy.
        </p>
        <button 
          onClick={() => router.push('/calendar')}
          className="flex px-5 py-2 items-center rounded-lg bg-green-500 text-2xl text-white"
          type="button"
        >
          Make your appointment now
        </button>
      </div>
    </div>
  )
}
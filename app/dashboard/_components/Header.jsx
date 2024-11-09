"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const path = usePathname()
  return (
    <div className='flex p-4 items-center justify-between bg-zinc-900 shadow-xl'>
        <Image src={'/logo.svg'} alt="logo" width={30} height={30} />
        <ul className='hidden md:flex gap-6 text-white'>
            <li className={`hover:text-amber-600 transition-all transform  cursor-pointer ${path=='/dashboard' && 'rounded px-1 bg-amber-600/90'}`}>Dashboard</li>
            <li className={`hover:text-amber-600 transition-all transform  cursor-pointer ${path=='/dashboard/questions' && 'rounded px-1 bg-amber-600/90'}`}>Questions</li>
            <li className={`hover:text-amber-600 transition-all transform  cursor-pointer ${path=='/dashboard/upgrade' && 'rounded px-1 bg-amber-600/90'}`}>Upgrade</li>
            <li className={`hover:text-amber-600 transition-all transform  cursor-pointer ${path=='/dashboard/how' && 'rounded px-1 bg-amber-600/90'}`}>How it works</li>
        </ul>
        <UserButton />
        </div>
  )
}

export default Header
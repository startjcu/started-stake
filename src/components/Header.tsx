import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


export default function Header() {
  const links = [
    { name: 'Contract', path: '/home' },
    { name: 'Stake', path: '/withdraw' },
  ]
  const path = usePathname()
  return (
    <div className='flex justify-end p-4 items-center'>
      {
        links.map(item => {
          return <Link key={item.name} href={item.path} className={(item.path === path ? 'text-blue-400' : 'text-gray-400') + ' mr-4'}>{item.name}</Link>
        })
      }
      <ConnectButton />
    </div>
  )
}

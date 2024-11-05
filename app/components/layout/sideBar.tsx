'use client'

import { Button } from '../'
import { usePathname } from 'next/navigation'
import { type FC, useState } from 'react'
import {
  Gear,
  Newspaper,
  Speedometer,
  ArrowUUpLeft,
  CaretDoubleRight,
  CaretDoubleLeft,
  ProjectorScreenChart,
} from '@phosphor-icons/react'


export const Sidebar: FC = () => {
  const pathname = usePathname();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)



  const menuItems = [
    { id: 'dashboard', icon: <Speedometer size={20} />, label: 'Painel' },
    {
      id: 'analytics',
      icon: <ProjectorScreenChart size={20} />,
      label: 'Análise',
    },
    {
      id: 'https://ajuda.muveplayer.com/novidades/novidades-no-muve',
      icon: <Newspaper size={20} />,
      label: 'Novidades',
    },
  ]

  const otherItems = [
    { id: 'profile', icon: <Gear size={20} />, label: 'Configurações' },
    { id: 'logout', icon: <ArrowUUpLeft size={20} />, label: 'Sair da conta' },
  ]


  return (
    <aside
      className={`h-screen ${isSideBarOpen ? 'w-80' : 'w-20'} rounded-xl flex flex-col items-start justify-start p-4 m-2 bg-[#1D1D1D] transition-width duration-300`}
    >
      <div className="w-full flex items-center justify-end border-b-[1px] border-[#333333] border-solid pb-6">
        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="w-6 h-6 rounded flex items-center justify-center border-[1px] border-solid border-[#777777] text-[#777777] hover:bg-[#777777] hover:text-white transition-all"
        >
          {!isSideBarOpen ? <CaretDoubleRight /> : <CaretDoubleLeft />}
        </button>
      </div>

      <div className="w-full h-full my-6 flex flex-col">
        <div className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === `/${item.id}` ? true : false;
            return (
              <Button
                type="button"
                variant="link"
                key={item.id}
                className={`w-full p-4 flex gap-4 items-center justify-start h-12 ${
                  isActive ? 'bg-[#333333] text-white' : ''
                }`}
              >
                {item.icon}
                {isSideBarOpen && item.label}{' '}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="w-full h-full my-6 flex flex-col">
        <div className="flex flex-col gap-3">
          {otherItems.map((item) => {
            const isActive = pathname === `/${item.id}` ? true : false;
            return (
              <Button
                type="button"
                variant="link"
                key={item.id}
                className={`w-full p-4 flex gap-4 items-center justify-start h-12 ${
                  isActive ? 'bg-[#333333] text-white' : ''
                }`}
              >
                {item.icon}
                {isSideBarOpen && item.label}{' '}
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
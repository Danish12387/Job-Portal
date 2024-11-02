'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from '@/utils/apiHandlers'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useAppSelector } from '@/lib/hooks'

export default function AuthNavbar() {
  const { user } = useAppSelector(state => state.user);
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const logoutHandler = async () => {
    await logout()
    router.push('/login');
  }

  const navItems = [
    { title: "Start a Search", href: "/job-search" },
    { title: "Job list", href: "#" },
    { title: "Create Job", href: "/create-job" },
    { title: "Salary estimate", href: "#" },
  ]

  return (
    <div className={`px-5 py-4 fixed mx-auto top-0 right-0 left-0 z-50 bg-white shadow-sm ${open ? 'pr-5' : ''}`}>
      <div className='flex items-center justify-between container mx-auto'>
        <Link href={`/`} className='flex items-center justify-between gap-2 cursor-pointer'>
          <img className='w-10' src="/logo.png" alt="Logo" />
          <h1 className='font-semibold text-xl'>Jobless</h1>
        </Link>
        <div className='hidden md:flex items-center gap-10 text-[15px]'>
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className='hover:text-primary transition-all cursor-pointer'>
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div onClick={() => setOpen(!open)} className={`flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-100 py-1 px-2 rounded focus-visible:ring-transparent border-none`}>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user?.fullname}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-4">
                {navItems.map((item, index) => (
                  <Link key={index} href={item.href} className='text-lg font-medium hover:text-primary transition-all'>
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
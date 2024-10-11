'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";


const AuthNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`px-5 py-4 fixed top-0 right-0 left-0 z-50 bg-white shadow-sm ${open ? 'pr-5' : ''}`}>
      <div className='flex items-center justify-between container mx-auto'>
        <Link href={`/`} className='flex items-center justify-between gap-2 cursor-pointer'>
          <img className='w-10' src="/logo.png" alt="Logo" />
          <h1 className='font-semibold text-xl'>Jobless</h1>
        </Link>
        <div className='flex items-center gap-10 text-[15px]'>
          <h3 className='hover:text-primary transition-all cursor-pointer'>Start a Search</h3>
          <h3 className='hover:text-primary transition-all cursor-pointer'>Job list</h3>
          <h3 className='hover:text-primary transition-all cursor-pointer'>Salary estimate</h3>
          <h3 className='hover:text-primary transition-all cursor-pointer'>Pricing</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div onClick={() => setOpen(!open)} className={`flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-200 py-1 px-2 rounded focus-visible:ring-transparent border-none`}>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>Username</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  )
}

export default AuthNavbar;
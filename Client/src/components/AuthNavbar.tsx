'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAppSelector } from '@/lib/hooks'
import { logout } from '@/utils/apiHandlers'
import { Menu } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthNavbar() {
  const { user } = useAppSelector(state => state.user);
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const logoutHandler = async () => {
    await logout();
    window.location.reload();
    router.push('/login');
  }

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Start a Search", href: "/job-search" },
    { title: "Posts", href: "/feed" },
    { title: "Create Job", href: "/create-job" },
  ]

  return (
    <div className={`px-5 py-4 fixed mx-auto top-0 right-0 left-0 z-50 bg-white shadow-sm ${open ? 'pr-5' : ''}`}>
      <div className='flex items-center justify-between container mx-auto'>
        <Link href={`/`} className='flex items-center justify-between gap-2 cursor-pointer'>
          <img className='w-10' src="/logo.png" alt="Logo" />
          <h1 className='font-semibold text-xl'>JobNexus</h1>
        </Link>
        <div className='hidden md:flex items-center gap-10 text-[15px]'>
          {navItems.map((item, index) => (
            item.title === 'Create Job' && user?.userRole !== 'Recruiter' ? null : (
              <Link
                key={index}
                href={item.href}
                className='hover:text-primary transition-all cursor-pointer'
              >
                {item.title}
              </Link>
            )
          ))}
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div onClick={() => setOpen(!open)} className={`flex items-center gap-2 cursor-pointer transition-all py-1 px-2 mr-10 rounded focus-visible:ring-transparent border-none`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture || '/dummy-person.jpg'} />
                  <AvatarFallback>
                    <img src="/dummy-person.jpg" alt="Profile" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
              <DropdownMenuLabel className='truncate'>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/profile/${user?._id}`}><DropdownMenuItem>Profile</DropdownMenuItem></Link>
              {
                user?.userRole === "Recruiter" && (
                  <Link href={`/manage-jobs`}><DropdownMenuItem>Manage Jobs</DropdownMenuItem></Link>
                )}
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
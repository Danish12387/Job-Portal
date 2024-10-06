import React from 'react'
import { Button } from './ui/button'

function Navbar() {
    return (
        <div className='flex items-center justify-between px-5 py-4 fixed top-0 right-0 left-0 z-50 bg-white shadow-sm'>
            <div className='flex items-center justify-between gap-2 cursor-pointer'>
                <img className='w-10' src="/logo.png" alt="Logo" />
                <h1 className='font-semibold text-lg '>Jobless</h1>
            </div>
            <Button className='hover:scale-105'>Log in</Button>
        </div>
    )
}

export default Navbar
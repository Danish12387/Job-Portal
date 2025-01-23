'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Ghost, Home, RefreshCcw } from 'lucide-react'
import { useEffect } from "react"

export default function NotFound() {
    useEffect(()=>{
        document.title = "404 | Page Not Found"
    },[]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <Ghost className="w-32 h-32 mx-auto text-primary mb-4 animate-bounce" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Page Not Found</h1>
                <p className="text-xl text-gray-600 mb-8">Looks like this page has vanished into thin air!</p>

                <div className="space-y-4">
                    <Button asChild className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 mx-2">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" /> Go Home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="bg-white text-primary hover:text-primary px-6 py-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 mx-2"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                </div>
            </div>

            <div className="mt-12 text-gray-500 animate-pulse">
                <p>Don't worry, even the best explorers get lost sometimes!</p>
            </div>
        </div>
    )
}
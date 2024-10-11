import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { NextPage } from "next";

const Home: NextPage = () => {
  const categories = Array(10).fill('Technology')
  const jobs = Array(5).fill({
    title: 'Fresher UI/UX Designer (1 Year Exp.)',
    company: 'Woo Creative',
    location: 'New York, USA',
    salary: '$14K - $25K',
    type: 'Full Time',
  })

  return (
    <MainLayout>
      <div>
        <section className="min-h-screen flex justify-center items-center pt-[75px] bg-primary/5">
          <div className="container flex justify-between mx-auto">
            <div className="w-2/4 p-5">
              <div className="w-full flex flex-col justify-between items-center gap-5">
                <h1 className="text-5xl font-semibold my-5">Find A <span className="text-primary">Job</span> That <span className="text-primary">Matches</span> Your Passion</h1>
                <h3 className="text-wrap">Hand-picked opportunities to work from home, remotely, freelance, full-time, part-time, contract and internships.</h3>
                <div className="h-12 flex items-center w-full relative">
                  <Input
                    className="px-10 h-full text-[16px] bg-white rounded-r-none border-none focus-visible:ring-transparent"
                    type="text"
                    placeholder="Search by job title"
                  />
                  <Search className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                  <Button className="h-full rounded-l-none">Search</Button>
                </div>
              </div>
            </div>
            <div className="w-2/4 flex justify-center items-center">
              <img className="w-[50%] max-w-xl" src="/job-pic.jpg" alt="job-pic" />
            </div>
          </div>
        </section>
        <section className="container mx-auto py-14">
          <h2 className="text-3xl text-center font-bold mb-10">Popular Categories</h2>
          <div className="grid grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                  <Image src="/logo.png" alt={category} width={32} height={32} />
                </div>
                <span className="text-sm text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto py-14">
          <h2 className="text-3xl text-center font-bold mb-10">All Popular Listed Jobs</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div key={index} className="shadow rounded-lg p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    J
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                    <p className="text-sm text-gray-600">{job.salary} • {job.type}</p>
                  </div>
                </div>
                <Button className="hover:scale-105">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Button className="hover:scale-105">
            Load More
          </Button>
        </div>
      </div>
    </MainLayout >
  )
}

export default Home;
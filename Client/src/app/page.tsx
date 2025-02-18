'use client'
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetHomeJobs from "@/hooks/useGetHomeJobs";
import { useAppSelector } from "@/lib/hooks";
import { createJob, getSearchedJobs, Job } from "@/utils/apiHandlers";
import { Loader2, MoveRight, Search } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const { homeJobs } = useAppSelector(state => state.jobs);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchJobs, setSearchJobs] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const categories = Array(10).fill('Technology');

  useGetHomeJobs();

  const fetchSearchedJobs = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchJobs([]);
        return;
      }
      const res = await getSearchedJobs(query);
      setSearchJobs(res?.job);
      setLoading(false);
    }, 500),
    []
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoading(true);
    setSearchTerm(value);
    setIsOpen(value.length > 0);
    fetchSearchedJobs(value);
  }

  const handleSearch = () => {
    if (searchTerm) {
      router.push(`/job-search?q=${searchTerm}`);
    }
  }

  const boomData = [
    {
      companyName: "Meta",
      websiteLink: "Not Available",
      jobTitle: "Backend Developer",
      jobLocationCountry: "United Kingdom",
      jobLocationCity: "New York",
      salaryRange: "20000",
      experience: "6 years",
      qualification: "Metric",
      applicationDeadline: "Oct 17, 2024",
      jobDescription: "We are looking for an exceptionally skilled Senior Mobile App Developer...",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Senior",
      salary: "Yearly",
      requirements: ["Master's degree in Computer Science"],
      responsibilities: ["Design, develop and test mobile applications for Android and iOS platforms"]
    },
    {
      companyName: "Google",
      websiteLink: "google.com",
      jobTitle: "Full Stack Developer",
      jobLocationCountry: "USA",
      jobLocationCity: "San Francisco",
      salaryRange: "150000",
      experience: "4 years",
      qualification: "Bachelor's",
      applicationDeadline: "Dec 1, 2024",
      jobDescription: "We are seeking an experienced Full Stack Developer with expertise in React and Node.js.",
      jobCategory: "Technology",
      jobType: "On-site",
      workExperience: "Mid-Level",
      salary: "Monthly",
      requirements: ["Bachelor's degree in Software Engineering"],
      responsibilities: ["Build full-stack applications using modern technologies"]
    },
    {
      companyName: "Apple",
      websiteLink: "apple.com",
      jobTitle: "iOS Developer",
      jobLocationCountry: "USA",
      jobLocationCity: "Cupertino",
      salaryRange: "180000",
      experience: "5 years",
      qualification: "Bachelor's",
      applicationDeadline: "Nov 5, 2024",
      jobDescription: "Looking for a highly skilled iOS Developer to work on next-gen mobile apps.",
      jobCategory: "Technology",
      jobType: "On-site",
      workExperience: "Mid-Level",
      salary: "Yearly",
      requirements: ["5 years of iOS development experience"],
      responsibilities: ["Develop, test, and deploy iOS apps"]
    },
    {
      companyName: "Tesla",
      websiteLink: "tesla.com",
      jobTitle: "Software Engineer",
      jobLocationCountry: "USA",
      jobLocationCity: "Austin",
      salaryRange: "170000",
      experience: "3 years",
      qualification: "Bachelor's",
      applicationDeadline: "Oct 30, 2024",
      jobDescription: "We are looking for a talented Software Engineer to join our autonomous vehicle team.",
      jobCategory: "Technology",
      jobType: "On-site",
      workExperience: "Junior",
      salary: "Yearly",
      requirements: ["Bachelor's degree in Computer Science"],
      responsibilities: ["Develop software for autonomous driving"]
    },
    {
      companyName: "Microsoft",
      websiteLink: "microsoft.com",
      jobTitle: "Cloud Architect",
      jobLocationCountry: "Canada",
      jobLocationCity: "Vancouver",
      salaryRange: "200000",
      experience: "7 years",
      qualification: "Master's",
      applicationDeadline: "Jan 10, 2025",
      jobDescription: "Looking for an experienced Cloud Architect to lead cloud infrastructure projects.",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Senior",
      salary: "Yearly",
      requirements: ["Master's in Computer Science or related field"],
      responsibilities: ["Design and maintain cloud infrastructure solutions"]
    },
    {
      companyName: "Amazon",
      websiteLink: "amazon.jobs",
      jobTitle: "DevOps Engineer",
      jobLocationCountry: "USA",
      jobLocationCity: "Seattle",
      salaryRange: "160000",
      experience: "5 years",
      qualification: "Bachelor's",
      applicationDeadline: "Nov 20, 2024",
      jobDescription: "Join our DevOps team to help scale cloud infrastructure for global services.",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Mid-Level",
      salary: "Yearly",
      requirements: ["Bachelor's in Computer Science or equivalent"],
      responsibilities: ["Implement CI/CD pipelines"]
    },
    {
      companyName: "Netflix",
      websiteLink: "netflix.com",
      jobTitle: "Data Engineer",
      jobLocationCountry: "USA",
      jobLocationCity: "Los Angeles",
      salaryRange: "180000",
      experience: "6 years",
      qualification: "Bachelor's",
      applicationDeadline: "Dec 15, 2024",
      jobDescription: "Seeking a Data Engineer to work on scaling data pipelines for our streaming service.",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Senior",
      salary: "Yearly",
      requirements: ["Bachelor's in Data Science or related field"],
      responsibilities: ["Design and maintain data pipelines"]
    },
    {
      companyName: "Facebook",
      websiteLink: "facebook.com",
      jobTitle: "Frontend Developer",
      jobLocationCountry: "USA",
      jobLocationCity: "Menlo Park",
      salaryRange: "140000",
      experience: "3 years",
      qualification: "Bachelor's",
      applicationDeadline: "Oct 31, 2024",
      jobDescription: "Looking for a talented frontend developer skilled in React.js and TypeScript.",
      jobCategory: "Technology",
      jobType: "On-site",
      workExperience: "Junior",
      salary: "Monthly",
      requirements: ["Experience in modern JavaScript frameworks"],
      responsibilities: ["Develop user interfaces for web applications"]
    },
    {
      companyName: "Spotify",
      websiteLink: "spotify.com",
      jobTitle: "Backend Developer",
      jobLocationCountry: "Sweden",
      jobLocationCity: "Stockholm",
      salaryRange: "120000",
      experience: "4 years",
      qualification: "Bachelor's",
      applicationDeadline: "Dec 5, 2024",
      jobDescription: "Join Spotify's backend team to develop services that scale to millions of users.",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Mid-Level",
      salary: "Monthly",
      requirements: ["Experience with backend technologies like Node.js"],
      responsibilities: ["Build and maintain backend APIs"]
    },
    {
      companyName: "Stripe",
      websiteLink: "stripe.com",
      jobTitle: "Full Stack Engineer",
      jobLocationCountry: "USA",
      jobLocationCity: "San Francisco",
      salaryRange: "190000",
      experience: "5 years",
      qualification: "Bachelor's",
      applicationDeadline: "Nov 10, 2024",
      jobDescription: "Full Stack Engineer with experience in Node.js and React.js to work on payment solutions.",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Mid-Level",
      salary: "Yearly",
      requirements: ["Bachelor's in Computer Science"],
      responsibilities: ["Develop and maintain full-stack applications"]
    },
    {
      companyName: "Oracle",
      websiteLink: "oracle.com",
      jobTitle: "Database Administrator",
      jobLocationCountry: "USA",
      jobLocationCity: "Redwood City",
      salaryRange: "130000",
      experience: "7 years",
      qualification: "Bachelor's",
      applicationDeadline: "Oct 25, 2024",
      jobDescription: "Seeking an experienced DBA to manage Oracle databases for enterprise clients.",
      jobCategory: "Technology",
      jobType: "Remote",
      workExperience: "Senior",
      salary: "Yearly",
      requirements: ["Experience with Oracle DBMS"],
      responsibilities: ["Manage and maintain Oracle database systems"]
    }
  ]

  const boom = async () => {
    await Promise.all(
      boomData.map(async (item) => {
        try {
          await createJob(item);
        } catch (error) {
          console.log(error);
        }
      })
    );
  };

  return (
    <MainLayout>
      <div>
        {/* <Button onClick={() => boom()}>Ready to boom!</Button> */}
        <section className="min-h-screen flex justify-center items-center bg-primary/5">
          <div className="container flex justify-between mx-auto">
            <div className="w-full md:w-2/4 p-5">
              <div className="w-full flex flex-col justify-between items-center gap-5">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="text-5xl font-semibold my-5"
                >
                  Find A <span className="text-primary">Job</span> That <span className="text-primary">Matches</span> Your Passion
                </motion.h1>
                <motion.h3
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-wrap"
                >
                  Hand-picked opportunities to work from home, remotely, freelance, full-time, part-time, contract and internships.
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  viewport={{ once: true }}
                  className="h-12 flex items-center w-full shadow-md relative"
                >
                  <div className="h-full w-full relative">
                    <Input
                      className="px-10 h-full text-[16px] bg-white rounded-r-none border-none focus-visible:ring-transparent"
                      type="text"
                      placeholder="Search by job title"
                      value={searchTerm}
                      onChange={handleInputChange}
                      aria-label="Search by job title"
                    />
                    {isOpen && (
                      <div className="absolute top-12 z-10 w-full bg-white border border-gray-200 rounded-b-md shadow-lg max-h-60 overflow-y-auto transition-all duration-300">
                        {loading ?
                          (<div className="px-6 py-2 border-b border-gray-200 flex justify-center items-center">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          </div>)
                          :
                          (searchJobs.length > 0
                            ?
                            (searchJobs?.map((job: Job, index) => (
                              <div
                                key={index}
                                className="px-6 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 group"
                                onClick={() => {
                                  setSearchTerm(`${job?.jobTitle}`)
                                  setIsOpen(false)
                                }}
                              >
                                <Link
                                  href={`/job-details/${job?._id}`}
                                  className="relative"
                                >
                                  <div>
                                    <h1 className="text-[16px] font-semibold">{job?.jobTitle}</h1>
                                    <p className="text-sm text-gray-500 line-clamp-1">{job?.jobDescription}</p>
                                  </div>
                                  <MoveRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 absolute right-0 top-1 h-5 text-primary transition duration-300" />
                                </Link>
                              </div>
                            )))
                            :
                            (
                              <div className="px-6 py-2 border-b border-gray-200">
                                <h1 className="text-[16px] text-center">No Results Found.</h1>
                              </div>
                            ))
                        }
                      </div>
                    )}
                  </div>
                  <Search className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                  <Button className="h-full rounded-l-none" onClick={handleSearch}>Search</Button>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-2/4 hidden md:flex justify-center items-center"
            >
              {/* <div className="w-2/4 hidden md:flex justify-center items-center"> */}
              <img className="w-[50%] max-w-xl pointer-events-none" src="/job-pic.jpg" alt="job-pic" />
              {/* </div> */}
            </motion.div>
          </div>
        </section>
        {/* <section className="container mx-auto py-14">
          <h2 className="text-2xl md:text-3xl text-center font-bold mb-10">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col bg-white p-4 rounded-lg items-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                  <Image src="/logo.png" alt={category} width={32} height={32} />
                </div>
                <span className="text-sm text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </section> */}

        <section className="container mx-auto py-10">
          <h2 className="text-2xl md:text-3xl text-center font-bold mb-10">All Popular Listed Jobs</h2>
          <div className="space-y-4">
            {homeJobs?.map((job, index) => (
              <div key={index} className="shadow rounded-lg p-6 bg-white flex sm:flex-row flex-col md:gap-0 gap-10 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    J
                  </div>
                  <div>
                    <h3 className="font-semibold text-[16px] sm:text-lg">{job.jobTitle}</h3>
                    <p className="text-sm text-gray-600">{job.companyName} • {job.jobLocationCountry}</p>
                    <p className="text-sm text-gray-600">{job.salary} • {job.jobType}</p>
                  </div>
                </div>
                <Link href={`/job-details/${job._id}`}>
                  <Button className="hover:scale-105">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link href={`/job-search`}>
            <Button className="hover:scale-105">
              See More
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout >
  )
}

export default Home;
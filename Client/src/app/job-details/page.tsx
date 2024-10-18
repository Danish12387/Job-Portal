import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";

export default function JobListing() {

    return (
        <MainLayout>
            <h1 className="text-2xl font-semibold bg-gray-100 py-6 text-center">Laravel Developer(Full time) - Match Company Limited</h1>
            <div className="container mx-auto py-6">
                <div className="space-x-2 flex items-center justify-center gap-5">
                    <Button variant='outline' className="hover:scale-105">
                        View Company
                    </Button>
                    <Button className="hover:scale-105">
                        Apply This Job
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div>
                        <p className=""><span className="test-[16px] font-semibold">Minimum Qualification:</span> Bachelor</p>
                        <p className=""><span className="test-[16px] font-semibold">Experience:</span> 5 years</p>
                        <p className=""><span className="test-[16px] font-semibold">Location:</span> San Francisco, US</p>
                    </div>
                    <div>
                        <p className=""><span className="test-[16px] font-semibold">Application Deadline:</span> 12/08/2022</p>
                        <p className=""><span className="test-[16px] font-semibold">Salary Range:</span> $70,000 - $90,000</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Job description</h2>
                    <p className="">
                        We are looking for a Laravel developer to build web applications for our company. In this role, you will design and create projects using
                        PHP and the Laravel framework. Your duties will include coding, designing, and testing features, as well as maintaining and improving
                        existing projects.
                    </p>
                    <p className=" mt-2">
                        To ensure success as a Laravel developer, you should be skilled at utilizing Laravel's CLI and be able to design a PHP application from start
                        to finish. A top-notch Laravel developer will be able to leverage their expertise and experience of the framework to independently produce
                        complete solutions to given development tasks.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Laravel Developer Requirements:</h2>
                    <ul className="list-disc list-inside  space-y-1">
                        <li>A degree in programming, computer science, or a related field.</li>
                        <li>Experience working with PHP, preferably with testing and debugging skills such as PHPUnit or PEST.</li>
                        <li>A solid understanding of application design using Laravel.</li>
                        <li>Knowledge of database design and querying using SQL.</li>
                        <li>Familiarity with HTML, CSS, and JavaScript.</li>
                        <li>Experience using version control systems such as Git is considered a plus.</li>
                        <li>Practical experience using the MVC architecture.</li>
                        <li>The ability to work in a LAMP development environment.</li>
                        <li>Problem-solving skills and critical thinking.</li>
                        <li>Great communication skills.</li>
                        <li>The ability to work in a team.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Responsibilities:</h2>
                    <ul className="list-disc list-inside  space-y-1">
                        <li>Managing projects with the client and development team.</li>
                        <li>Designing and building applications using Laravel.</li>
                        <li>Troubleshooting issues in the implementation and debugging builds.</li>
                        <li>Writing clean, testable code with accompanying documentation.</li>
                        <li>Testing and deploying applications and systems.</li>
                        <li>Revising, updating, refactoring and debugging code.</li>
                        <li>Improving the performance of applications.</li>
                        <li>Integrating data storage solutions.</li>
                        <li>Developing and implementing application security.</li>
                        <li>Maintaining and improving existing codebases and peer review code changes.</li>
                        <li>Collaborating with front-end developers to integrate user-facing elements.</li>
                    </ul>
                </div>
            </div>
        </MainLayout>
    )
}
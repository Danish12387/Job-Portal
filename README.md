<h1>Job Portal Web Application</h1>
    <p>This is a fully functional Job Portal built with <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Node.js</strong>, and <strong>MongoDB</strong>. The application allows both users and clients (employers) to interact with the platform in multiple ways, offering a seamless experience for job searching, posting, and managing profiles. It's packed with features like job search, filtering, and an interactive profile page, allowing users and employers to fully manage their details and job postings.</p>

<h2>Features</h2>

 <h3>For Users:</h3>
    <ul>
        <li><strong>Job Search and Filter</strong>: Search and filter jobs by title, location, salary, experience, and more. You can find jobs based on specific criteria such as:
            <ul>
                <li>Location (e.g., near-me, remote)</li>
                <li>Time (e.g., last 24 hours, last 7 days)</li>
                <li>Salary (hourly, monthly, yearly)</li>
                <li>Work Experience (e.g., senior, internship, entry-level)</li>
                <li>Job Type (full-time, part-time, contract)</li>
            </ul>
        </li>
        <li><strong>Profile Page</strong>: Users can manage their profile details:
            <ul>
                <li>Edit personal information such as <strong>name</strong>, <strong>country</strong>, <strong>city</strong>, <strong>hobbies</strong>, and <strong>about</strong>.</li>
                <li>Update <strong>language</strong>, <strong>work history</strong>, and <strong>nickname</strong>.</li>
                <li>Upload a <strong>profile picture</strong> and <strong>profile banner</strong>.</li>
            </ul>
        </li>
        <li><strong>Job Application</strong>: Apply to job listings and manage applications directly through your profile.</li>
        <li><strong>Pagination & Infinite Scroll</strong>: Job listings load in batches with infinite scrolling for a smooth browsing experience.</li>
    </ul>

 <h3>For Clients (Employers):</h3>
    <ul>
        <li><strong>Job Posting</strong>: Clients can post new job listings with detailed job descriptions, salary, location, and required skills.</li>
        <li><strong>Job Management</strong>: Clients can view and manage all their posted jobs:
            <ul>
                <li><strong>Edit</strong> job postings.</li>
                <li><strong>Delete</strong> job postings.</li>
                <li>View application stats and manage candidates.</li>
            </ul>
        </li>
        <li><strong>Profile Management</strong>: Employers can manage their company profile with relevant information and branding.</li>
    </ul>

   <h3>Profile Management (for both users and clients):</h3>
    <ul>
        <li><strong>Personal Details</strong>: Both users and clients can update personal details like <strong>name</strong>, <strong>location</strong>, <strong>language</strong>, and <strong>about</strong> sections.</li>
        <li><strong>Profile Picture & Banner</strong>: Upload a custom <strong>profile picture</strong> and <strong>banner</strong> for a personalized experience.</li>
        <li><strong>Work History</strong>: Display and edit previous work experience and professional history.</li>
        <li><strong>Additional Information</strong>: Add hobbies, interests, and other custom information to enhance the profile.</li>
    </ul>
    <h3>Current and Upcoming Features:</h3>
    <ul>
        <li><strong>Posts, Comments, and Likes</strong>: We're working on a social-like feature where users can comment on job listings, like them, and post updates to their profiles.</li>
        <li><strong>Bug Fixes</strong>: Ongoing bug fixing and optimizations to improve the overall user experience.</li>
    </ul>

  <h2>Tech Stack:</h2>
    <ul>
        <li><strong>Frontend</strong>: Next.js, TypeScript, React</li>
        <li><strong>Backend</strong>: Node.js, Express.js</li>
        <li><strong>Database</strong>: MongoDB</li>
        <li><strong>Authentication</strong>: JWT, Session-based authentication</li>
    </ul>

  <h2>Installation & Setup</h2>
    <ol>
        <li>Clone the repository:
            <pre><code>git clone https://github.com/your-username/job-portal.git</code></pre>
            <pre><code>cd job-portal</code></pre>
        </li>
        <li>Install dependencies:
            <pre><code>npm install</code></pre>
        </li>
        <li>Set up environment variables in <strong>.env</strong>:
            <ul>
                <li><strong>MONGO_URI</strong> - MongoDB connection string</li>
                <li><strong>JWT_SECRET</strong> - Secret key for JWT</li>
                <li>Other configuration variables as required</li>
            </ul>
        </li>
        <li>Run the development server:
            <pre><code>npm run dev</code></pre>
        </li>
        <li>Visit <strong>http://localhost:3000</strong> in your browser to view the application.</li>
    </ol>

 <h2>Roadmap:</h2>
    <ul>
        <li><strong>Further Feature Development</strong>: Adding advanced search functionality, notifications, and a recommendation engine.</li>
        <li><strong>Performance Optimization</strong>: Enhancing the app for scalability and faster load times.</li>
        <li><strong>Bug Fixing</strong>: Continuously improving the app by addressing any reported issues.</li>
    </ul>

 <p>Feel free to contribute to this project or open an issue if you encounter any bugs or have suggestions for improvements!</p>

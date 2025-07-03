import { useState, useEffect } from 'react';
import api from '../api';
import Job from '../components/Jobposting'; // This should point to your Job component
import '../styles/Home.css';

function Home() {
    const [jobs, setJobs] = useState([]);
    const [job_title, setTitle] = useState("");
    const [job_company, setCompany] = useState("");
    const [job_location, setLocation] = useState("");
    const [job_setup, setSetup] = useState("");
    const [job_type, setType] = useState("");
    const [min_salary, setMinSal] = useState("");
    const [max_salary, setMaxSal] = useState("");
    const [job_description, setDescription] = useState("");
    const [job_requirements, setRequirement] = useState("");
    const [job_benefits, setBenefits] = useState("");

    useEffect(() => {
        getJobs();
    }, []);

    const getJobs = () => {
        api.get("/api/jobposting/")
            .then((res) => setJobs(res.data))
            .catch((err) => alert(err));
    };

    const deleteJobs = (id) => {
        api.delete(`/api/jobposting/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Job deleted!");
                else alert("Failed to delete Job");
                getJobs();
            })
            .catch((error) => alert(error));
    };

    const createJobs = (e) => {
        e.preventDefault();
        api.post("/api/jobposting/", {
            job_title,
            job_company,
            job_location,
            job_setup,
            job_type,
            min_salary,
            max_salary,
            job_description,
            job_requirements,
            job_benefits
        })
            .then((res) => {
                if (res.status === 201) alert("Job created!");
                else alert("Failed to create Job");
                getJobs();
            })
            .catch((error) => alert(error));
    };

    return (
        <div className="container">
            <div className="notes-section">
                <h2>Job Postings</h2>
                {jobs.map((job) => (
                    <Job job={job} onDelete={deleteJobs} key={job.id} />
                ))}
            </div>

            <form onSubmit={createJobs}>
    <h2>Create a Job Posting</h2>
    
    <input
        type="text"
        placeholder="Title"
        value={job_title}
        onChange={(e) => setTitle(e.target.value)}
        required
    />
    
    <input
        type="text"
        placeholder="Company"
        value={job_company}
        onChange={(e) => setCompany(e.target.value)}
        required
    />
    
    <input
        type="text"
        placeholder="Location"
        value={job_location}
        onChange={(e) => setLocation(e.target.value)}
        required
    />

    {/* Job Setup Dropdown */}
    <select value={job_setup} onChange={(e) => setSetup(e.target.value)} required>
        <option value="" disabled>Select Setup</option>
        <option value="Onsite">Onsite</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
    </select>

    {/* Job Type Dropdown */}
    <select value={job_type} onChange={(e) => setType(e.target.value)} required>
        <option value="" disabled>Select Job Type</option>
        <option value="Full-Time">Full-Time</option>
        <option value="Part-Time">Part-Time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
    </select>

    <input
        type="number"
        placeholder="Min Salary"
        value={min_salary}
        onChange={(e) => setMinSal(e.target.value)}
        required
    />
    
    <input
        type="number"
        placeholder="Max Salary"
        value={max_salary}
        onChange={(e) => setMaxSal(e.target.value)}
        required
    />
    
    <textarea
        placeholder="Description"
        value={job_description}
        onChange={(e) => setDescription(e.target.value)}
        required
    />
    
    <textarea
        placeholder="Requirements"
        value={job_requirements}
        onChange={(e) => setRequirement(e.target.value)}
        required
    />
    
    <textarea
        placeholder="Benefits"
        value={job_benefits}
        onChange={(e) => setBenefits(e.target.value)}
        required
    />
    
    <input type="submit" value="Create Job" />
</form>
        </div>
    );
}

export default Home;

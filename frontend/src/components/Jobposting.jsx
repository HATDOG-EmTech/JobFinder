import React from 'react';
import '../styles/Job.css';

function Job({ job, onDelete }) {
    return (
        <div className="job-container">
            <p className="job-title">{job.job_title}</p>
            <p className="job-details">Company: {job.job_company}</p>
            <p className="job-details">Location: {job.job_location}</p>
            <p className="job-details">Setup: {job.job_setup}</p>
            <p className="job-details">Type: {job.job_type}</p>
            <p className="job-salary">Salary: {job.min_salary} - {job.max_salary}</p>
            <p className="job-details">Description: {job.job_description}</p>
            <p className="job-details">Requirements: {job.job_requirements}</p>
            <p className="job-details">Benefits: {job.job_benefits}</p>
            <button className="delete-button" onClick={() => onDelete(job.id)}>Delete</button>
        </div>
    );
}

export default Job;
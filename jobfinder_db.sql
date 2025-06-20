-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2025 at 09:21 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobfinder_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `application_tb`
--

CREATE TABLE `application_tb` (
  `application_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `application_name` varchar(500) NOT NULL,
  `status` enum('Applied','Under Review','Interview','Accepted','Rejected') NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs_tb`
--

CREATE TABLE `jobs_tb` (
  `job_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `job_title` varchar(30) NOT NULL,
  `job_company` varchar(100) NOT NULL,
  `job_setup` enum('Onsite','Remote','Hybrid','') NOT NULL,
  `job_type` enum('Full-TIme','Part-Time','Contract','Internship') NOT NULL,
  `job_salary` varchar(20) NOT NULL,
  `job_description` varchar(500) NOT NULL,
  `job_requirements` varchar(500) NOT NULL,
  `job_benefits` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `links_tb`
--

CREATE TABLE `links_tb` (
  `link_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `portfolio` varchar(500) NOT NULL,
  `linkedin` varchar(500) NOT NULL,
  `github` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_tb`
--

CREATE TABLE `users_tb` (
  `user_id` int(11) NOT NULL,
  `f_name` varchar(30) NOT NULL,
  `l_name` varchar(20) NOT NULL,
  `m_initial` varchar(3) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `location` varchar(100) NOT NULL,
  `user_title` varchar(30) NOT NULL,
  `bio` varchar(500) NOT NULL,
  `skills` varchar(500) NOT NULL,
  `cv_path` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_tb`
--
ALTER TABLE `application_tb`
  ADD PRIMARY KEY (`application_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `job_id` (`job_id`);

--
-- Indexes for table `jobs_tb`
--
ALTER TABLE `jobs_tb`
  ADD PRIMARY KEY (`job_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `links_tb`
--
ALTER TABLE `links_tb`
  ADD PRIMARY KEY (`link_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users_tb`
--
ALTER TABLE `users_tb`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application_tb`
--
ALTER TABLE `application_tb`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs_tb`
--
ALTER TABLE `jobs_tb`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `links_tb`
--
ALTER TABLE `links_tb`
  MODIFY `link_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_tb`
--
ALTER TABLE `users_tb`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_tb`
--
ALTER TABLE `application_tb`
  ADD CONSTRAINT `application_tb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tb` (`user_id`),
  ADD CONSTRAINT `application_tb_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs_tb` (`job_id`);

--
-- Constraints for table `jobs_tb`
--
ALTER TABLE `jobs_tb`
  ADD CONSTRAINT `jobs_tb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tb` (`user_id`);

--
-- Constraints for table `links_tb`
--
ALTER TABLE `links_tb`
  ADD CONSTRAINT `links_tb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tb` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

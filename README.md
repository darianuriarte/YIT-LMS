# Youth in Transformation Learning Management System (LMS)

## Table of Contents
1. [Abstract](#abstract)
2. [Introduction](#introduction)
   - Problem Statement
   - Contribution
3. [Project Solution](#project-solution)
   - Project Overview
   - User Roles & Permissions
   - System Architecture
   - Technology Stack
   - User Flow Chart
4. [Implementation](#implementation)
   - Code Access
   - Installing Node.js and npm
   - Installing Dependencies
   - Creating the Environment File
   - Running the Application
5. [Future Work](#future-work)
6. [Biography](#biography)

---

## Abstract
This document provides an in-depth overview of the Learning Management System (LMS) developed for Youth in Transformation (YIT). The LMS is a web-based platform built on the MERN (MongoDB, Express.js, React.js, and Node.js) stack, designed to streamline YIT's workflow by consolidating all tasks into a single platform. It covers various aspects of the LMS, including the high-level architecture, user roles, access control, and permissions, elaborating on the components and modules that constitute the system. Additionally, the document outlines the data flow and interactions among different user roles. It also provides clear instructions on how to use the code and includes a roadmap for planned future work. Developers and administrators involved in the Youth in Transformation Learning Management System project will find this documentation valuable as it offers insights into the system's functionalities, ensuring a smooth and productive user experience within the LMS environment.

## Introduction
### Problem Statement
Youth in Transformation aims to provide South African students with the resources they need to succeed in their education and achieve a better future. They offer personalized tutoring sessions through two programs: STEAM+ for high school students and The Butterfly Project for elementary girls. The main challenge faced by YIT is managing a large number of students and tutors manually using multiple spreadsheets and disorganized tools. This cumbersome process hinders their ability to effectively track individual student and tutor activities, such as attendance, grades, and hours worked. To address this challenge, a Learning Management System (LMS) is being developed to consolidate all program-related information into a single platform, simplifying organization and reducing time spent on administrative tasks.

### Contribution
To address the challenges mentioned in the problem statement, a comprehensive LMS is being developed to rationalize YIT's operations. The LMS will offer role-based access and permissions, allowing administrators, tutors, and students to access information based on their account rights. Comprehensive analytics and reporting functionalities will enable tutors and administrators to monitor payroll, hours worked, student performance, and make data-driven decisions to optimize the learning process. An intuitive and user-friendly interface will be at the core of the LMS design, facilitating effective utilization for all users, including those with limited technical expertise.

## Project Solution
### Project Overview
The Learning Management System (LMS) project for Youth in Transformation aims to provide an efficient and comprehensive platform for managing educational content and tracking student and tutor activities. The LMS will encompass a wide range of features and functionalities, catering to the specific roles of administrators, tutors, and students. The key functionalities include:
- Admin Features: The admin dashboard will serve as the central control panel for administrators, providing access to student profile management, user management, session monitoring, payroll, surveys, and a chat feature.
- Tutor Features: Tutors will have the ability to create and manage sessions, manage students, upload course materials and quizzes, and interact with students through the platform.
- Student Features: Students can view their sessions, access course materials, view announcements, and access surveys.
- User Management: The LMS will support user registration, login, and profile management, allowing administrators to oversee and maintain user accounts.

### User Roles & Permissions
The LMS implements role-based access control (RBAC) to manage user permissions effectively. Administrators have full access, performing administrative tasks and accessing all reports and analytics. Tutors have intermediate-level access, managing learning sessions, course content, and student progress. Students have limited access, participating in their enrolled sessions, viewing course materials, surveys, and tracking their progress. RBAC ensures data integrity and a secure, personalized learning environment within the Youth in Transformation Learning Management System.

### System Architecture
The LMS is designed with a role-based architecture and RBAC to efficiently cater to the needs of different users, including admins, tutors, and students. Each role is associated with specific pages and components, ensuring a tailored user experience. The high-level architecture consists of role-based routing, directing users to their respective role pages upon login. Administrators access essential admin pages, while tutors and students are directed to their own home page, the Session Dashboard.

### Technology Stack
The learning management system (LMS) project is being developed using the MERN stack and various third-party libraries. The MERN stack consists of MongoDB (a document-based database), Express.js (a web application framework for Node.js), React.js (a frontend JavaScript library), and Node.js (a server-side runtime environment). Third-party libraries include Material-UI (a React UI framework with Material Design aesthetics), Axios (a JavaScript library for making HTTP requests), and React Router (a routing library for React.js applications).

## Implementation
1. Code Access: The application's code is located in a Github repository. To run the application on a local machine, download the code from github.com/donbool/UF-YIT.
2. Installing Node.js and npm: Before running the code, install Node.js and npm from nodejs.org.
3. Installing Dependencies: Navigate to the project folder and install the necessary dependencies using npm install.
4. Creating the Environment File: Create an .env file in the backend folder to connect to the database.
5. Running the Application: Run the backend and frontend of the application separately using npm start.

## Future Work
The LMS is currently in development, and future work includes implementing additional features for the Admin Dashboard, Tutor Dashboard, and Student Dashboard. Other planned enhancements involve security measures, quiz management, surveys and feedback, clock-in/clock-out functionality, routing protection, and component and page separation. The platform will also differentiate between Butterfly and STEAM+ tutors and optimize resource accessibility and course materials management.


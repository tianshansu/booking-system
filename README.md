# Booking Management System

A full-stack appointment management system designed for medical, therapy, or consulting service scenarios.  
The system provides an admin workflow for managing patients, staff, appointments, session statuses, CSV operations, dashboard insights, and an AI-powered help assistant.

## Overview

This project simulates a real-world admin booking platform where administrators can manage people records, create and update appointment sessions, track upcoming sessions, and export operational data.

The frontend was initially styled with custom CSS files during the first implementation phase. After the core workflows were completed, I refactored the interface using Material UI (MUI) to create a more consistent, reusable, and professional admin dashboard experience. The redesigned UI uses component-based layouts, cards, dialogs, forms, tables, navigation elements, and feedback components across the system.

It also includes an AI Help Assistant that allows logged-in users to ask questions about how to use the system. The assistant is integrated through a protected backend API and answers based on a project-specific system guide.

The application is deployed with the frontend hosted on Vercel, the backend API hosted on Render, and the PostgreSQL database hosted on Neon.

## Tech Stack

**Frontend:** React, JavaScript, HTML, CSS, Material UI (MUI)  
**Backend:** Node.js, Express.js, REST APIs  
**Database:** PostgreSQL, Neon  
**Authentication:** JWT, bcrypt  
**AI Integration:** OpenAI API  
**Tools/Libraries:** Luxon, Multer, csv-parse, dotenv  
**Deployment:** Vercel for frontend, Render for backend, Neon for PostgreSQL database

## Key Features

### Authentication

- Admin login with JWT-based authentication
- Password hashing using bcrypt
- Protected backend routes using authentication middleware
- Token-based access control for admin-only features

### People Management

- Manage patient and staff records
- Create, view, edit, and update people information
- Support active and inactive user status
- Search, sort, filter, and paginate people records
- Import people records from CSV files

### Session Management

- Create, edit, complete, cancel, and delete appointment sessions
- Manage session status workflows:
  - Scheduled
  - Completed
  - Cancelled
- Link sessions with patients and staff members
- Support Melbourne timezone handling
- Search, filter, sort, and paginate session records

### CSV Operations

- Import people records from CSV files
- Export session records as CSV files
- Exported session data follows the current filter conditions
- CSV export includes session details such as patient, staff, date, time, and status

### Dashboard

- Display today’s sessions
- Display upcoming sessions for the next 7 days
- Show recent system activities
- Provide a quick overview of current booking operations

### AI Help Assistant

- Floating AI assistant available on authenticated admin pages
- Users can ask questions about how to use the system
- Backend-protected AI API keeps the API key hidden from the frontend
- Uses a project-specific system guide to answer questions about:
  - Dashboard usage
  - People management
  - Session workflows
  - CSV import and export
  - General system operations
- Includes chat-style message history, loading state, and error handling

### UI Refactoring and Admin Experience

- Initially implemented the frontend styling with custom CSS files
- Later refactored the interface using Material UI (MUI) to improve consistency, maintainability, and visual quality
- Built a structured admin layout with sidebar navigation and header bar
- Replaced custom UI patterns with reusable MUI cards, dialogs, forms, tables, buttons, and feedback components
- Created a more unified visual design across dashboard, people, sessions, settings, help, login, and AI assistant pages

## My Role

- Built React pages for dashboard, people management, session management, and admin workflows
- Initially built the frontend styling with custom CSS files, then refactored the UI using Material UI (MUI) for a more consistent and reusable admin dashboard design
- Reworked key interface elements with MUI components, including layout structure, cards, dialogs, tables, form controls, buttons, navigation, and feedback messages
- Built Express REST APIs for authentication, people, sessions, dashboard data, and AI assistant functionality
- Designed PostgreSQL data models for users, people, sessions, and activity records
- Implemented JWT-based login authentication with password hashing
- Implemented protected backend routes using authentication middleware
- Implemented session status workflows for scheduled, completed, and cancelled sessions
- Implemented search, filtering, sorting, pagination, CSV import, and CSV export
- Integrated OpenAI API through a backend route to power the AI Help Assistant
- Created a project-specific AI system guide for help assistant responses
- Connected frontend pages with backend APIs through RESTful communication
- Handled Melbourne timezone conversion using Luxon
- Deployed the frontend on Vercel
- Deployed the backend API on Render
- Deployed the PostgreSQL database on Neon

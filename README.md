# Team Workflow App

Full-stack Task Management System built using React, Node.js, Express, MongoDB, and TypeScript.

This application enables teams and users to create, assign, manage, track, and complete tasks through a secure role-based workflow system.

---

# Live Demo

Frontend:
`https://team-workflow-app-newnop.vercel.app/`

Backend API:
`https://team-workflow-app-newnop-production.up.railway.app/api/auth/register`

---

# Repository

```bash
git clone https://github.com/AnusaraKarunaratna/Team-Workflow-App-Newnop.git

cd team-workflow-app
```

---

# Features

## Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Session Persistence
* Role-Based Access Control (RBAC)

---

## Role Management

### Admin

* View all tasks
* Create tasks
* Edit tasks
* Delete tasks
* Assign tasks
* Access administrative views

### User

* View assigned tasks
* View created tasks
* Create tasks
* Update own tasks

---

## Task Management

Users can:

* Create tasks
* View tasks
* View task details
* Edit tasks
* Delete tasks
* Assign users

Task fields:

* Title
* Description
* Priority
* Status
* Due Date
* Assigned User
* Created User

---

## Workflow States

Supported statuses:

```plaintext
OPEN
IN_PROGRESS
TESTING
DONE
```

Priority levels:

```plaintext
LOW
MEDIUM
HIGH
```

---

## Search & Filtering

Implemented:

* Search by title
* Filter by status
* Filter by priority
* Pagination

Example:

```http
GET /api/tasks?page=1&limit=10&search=bug&status=OPEN
```

---

# Technology Stack

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Axios
* React Hook Form
* React Hot Toast

---

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* Winston Logger

---

## Testing

Automated backend testing implemented using Jest.

Covered areas:

* Authentication APIs
* Authorization middleware
* Task CRUD services
* API validation
* Error handling

Run tests:

```bash
cd backend

npm test
```

Coverage:

```bash
npm run test:coverage
```

---

# CI/CD Pipeline

Continuous Integration and Deployment pipeline implemented.

Pipeline stages:

```plaintext
Code Push
↓

Dependency Install
↓

Build Verification
↓

Execute Jest Test Suite
↓

Deployment
```

Implemented capabilities:

* Automated build
* Automated backend testing
* Deployment automation
* Environment validation
* Continuous delivery workflow

---

# Deployment

Application deployed to production.

Frontend:

* Vercel

Backend:

* Vercel

Database:

* MongoDB Atlas

Deployment includes:

* Environment variables
* Secure API communication
* Production configuration
* CORS setup

---

# Architecture

Backend Architecture:

```plaintext
Routes
↓

Controllers
↓

Services
↓

Middleware
↓

MongoDB
```

Frontend Architecture:

```plaintext
Pages
↓

Components
↓

Services
↓

API Layer
```

---

# Project Structure

```plaintext
team-workflow-app

frontend/
│
├── src
│   ├── api
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   ├── routes
│   ├── services
│   ├── types
│   └── utils

backend/
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── types
│   └── utils
```

---

# Installation

## Backend

Move into backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_EXPIRES=7d
```

Run backend:

```bash
npm run dev
```

Build:

```bash
npm run build
```

---

## Frontend

Move into frontend:

```bash
cd frontend
```

Install:

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Build:

```bash
npm run build
```

---

# API Documentation

## Authentication

Register

```http
POST /api/auth/register
```

Login

```http
POST /api/auth/login
```

Current User

```http
GET /api/auth/me
```

---

## Tasks

Get Tasks

```http
GET /api/tasks
```

Get Task

```http
GET /api/tasks/:id
```

Create Task

```http
POST /api/tasks
```

Update Task

```http
PUT /api/tasks/:id
```

Delete Task

```http
DELETE /api/tasks/:id
```

---

# Error Handling

Implemented:

* Global Error Middleware
* Async Handler
* Structured API Responses
* Validation Errors

Example:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

# Logging

Backend request logging implemented.

Capabilities:

* Request logs
* Error logs
* Console logging
* File logging

---

# Security

Implemented:

* Password hashing
* JWT authentication
* Protected APIs
* Role-based authorization
* Environment variables
* Secure backend architecture

---

# User Experience Enhancements

Implemented:

* Loading states
* Empty states
* Toast notifications
* Optimistic updates
* Responsive layout
* Search & filters

---

# Future Improvements

Potential roadmap:

* Real-time notifications
* WebSocket updates
* Docker support
* Activity logs
* File uploads
* Team workspaces
* Email notifications
* Monitoring dashboard

---

# Design Decisions

### Why MongoDB

Flexible schema design for rapidly evolving task workflows.

### Why JWT

Stateless authentication suitable for scalable APIs.

### Why TypeScript

Improved maintainability and type safety.

### Why Service Layer

Separation of concerns and scalable backend architecture.

---

# Author

Developed as a technical assignment demonstrating:

* Full Stack Engineering
* System Design
* API Architecture
* Authentication & Authorization
* Testing
* CI/CD
* Production Deployment

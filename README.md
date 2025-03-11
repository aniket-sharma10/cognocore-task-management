# Task Management System

A simple Task Management System with CRUD operations using MongoDB, Express, React, and Node.js.

## Features
- Create, read, update, and delete tasks
- User-friendly UI for managing tasks

## API Endpoints
- **POST** `/api/tasks/` - Add a new task
- **GET** `/api/tasks/` - Fetch all tasks
- **PATCH** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

## Tech Stack
- **Frontend:** 
  - React (with TypeScript)
  - Tailwind CSS
  - ShadCN UI Components
- **Backend:** 
  - Node.js
  - Express
- **Database:**
  - MongoDB

## Deployed Application URL
You can access the live application here: https://cognocore-task-management.vercel.app/

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/aniket-sharma10/cognocore-task-management.git
cd cognocore-task-management
```

### 2. Install Dependencies
```bash
npm install
cd frontend && npm install
```

### 3. Environment Variables
Create a `.env` file in the **root** directory with the following:
```
MONGODB_URI=<your-mongodb-uri>
```

### 4. Run the Project
#### Backend (from root directory)
```bash
npm run dev
```
#### Frontend (from `/frontend` directory)
```bash
npm run dev
```

## Notes
- Both frontend and backend are deployed on Vercel for simplicity.
- Ensure your MongoDB URI is correctly configured in your environment variables.
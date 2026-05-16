# SmartLeads Dashboard

A modern, decoupled MERN stack application for managing sales leads efficiently.

## Prerequisites
- Docker and Docker Compose installed on your machine.

## Setup Instructions

1. **Environment Variables**
   Create a `.env` file in the `/backend` directory based on the `.env.example` file:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Note: When running with Docker Compose, the `MONGO_URI` is automatically overridden by docker-compose to connect to the internal MongoDB container.*

2. **Run the Application**
   From the root of the workspace, run the following command to build and spin up all containers:
   ```bash
   docker-compose up --build
   ```

3. **Access the App**
   - **Frontend UI**: http://localhost
   - **Backend API**: http://localhost:5000

## Architecture
- **Frontend**: React, TypeScript, Vite, Tailwind CSS (Served efficiently via Nginx).
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Database**: MongoDB.

## Backend REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a JWT

### Leads (Requires JWT Bearer Token)
- `GET /api/leads` - Get all leads (Supports filtering, search, sorting, and pagination)
- `POST /api/leads` - Create a new lead
- `GET /api/leads/:id` - Get a specific lead by ID
- `PUT /api/leads/:id` - Update a specific lead
- `DELETE /api/leads/:id` - Delete a lead (Admin only)
- `GET /api/leads/export` - Export leads as a CSV file (Admin only)

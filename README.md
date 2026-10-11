# GramHealthcare 🌿🏥

### Connecting rural communities with accessible, coordinated healthcare

GramHealthcare is a full-stack healthcare coordination web application
focused on helping rural communities connect with healthcare services.
It brings together a React-based frontend and an Express API backed by
MySQL, with a map interface powered by Leaflet.

> **Project status:** Hackathon project\
> **Repository:** https://github.com/codebyurvee/GramHealthcare-

## Table of Contents

-   [The Problem](#the-problem)
-   [Our Solution](#our-solution)
-   [Key Capabilities](#key-capabilities)
-   [Technology Stack](#technology-stack)
-   [How the Application Works](#how-the-application-works)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Configuration](#environment-configuration)
-   [API and Data](#api-and-data)
-   [Testing](#testing)
-   [Security and Responsible Use](#security-and-responsible-use)
-   [Limitations and Future
    Improvements](#limitations-and-future-improvements)
-   [Team and Acknowledgements](#team-and-acknowledgements)

## The Problem

People in rural and underserved communities can face difficulties
finding suitable healthcare facilities and coordinating care between
community-level services and receiving facilities. Referral information
and follow-up can also be difficult to track when processes are
fragmented.

## Our Solution

GramHealthcare is designed to support a more connected referral journey
by bringing healthcare-related information and workflows into one web
application. The project combines a browser-based interface, a
server-side API, a relational database, and map functionality.

The goal is to make healthcare coordination easier to understand and
manage---not to replace qualified healthcare professionals or emergency
services.

## Key Capabilities

The application is built around these healthcare coordination areas:

-   **Patient information:** Support for patient-related workflows in
    the application.
-   **Healthcare referrals:** A central workflow for coordinating a
    patient's referral between healthcare services.
-   **Healthcare facilities:** Facility-related information to help
    users understand available destinations for care.
-   **Map-based interface:** Leaflet is included in the frontend stack
    for geographic presentation.
-   **Web-based user interface:** A React application built with Vite.
-   **Backend API:** An Express server intended to handle application
    requests.
-   **Relational data storage:** MySQL is the database driver identified
    in the backend dependencies.

> **Feature accuracy note:** The bullets above describe the project's
> stated scope and technology-supported areas. The exact actions
> available in the current UI depend on the implementation in the
> repository. Do not interpret this list as confirmation that every
> workflow, notification, or integration is live in production.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Role
  ----------------------- ----------------------- -----------------------
  Frontend                React 18                Component-based user
                                                  interface

  Frontend tooling        Vite 5                  Development server and
                                                  production build

  Navigation              React Router DOM 6      Client-side routing

  HTTP requests           Axios                   Communication with the
                                                  backend API

  Maps                    Leaflet                 Interactive map and
                                                  geographic UI

  Backend                 Node.js and Express 4   HTTP API and
                                                  server-side logic

  Database driver         `mysql2`                MySQL connectivity

  Configuration           `dotenv`                Loads environment
                                                  variables

  Request logging         Morgan                  HTTP request logging
                                                  during server operation
  -----------------------------------------------------------------------

## How the Application Works

At a high level, the application follows this architecture:

``` text
User's browser
     |
     v
React + Vite frontend
     |
     | HTTP requests (Axios)
     v
Node.js + Express API
     |
     | mysql2 database driver
     v
MySQL database
```

The frontend presents the user interface and sends requests to the API.
The backend is responsible for processing requests and interacting with
persistent data. The database stores application records.

### Core workflow concept

``` text
Patient information
       |
       v
Referral workflow
       |
       v
Healthcare facility
       |
       v
Referral progress and follow-up
```

The exact status transitions and available actions should be checked
against the current implementation and API routes.

## Project Structure

The repository contains separate frontend and backend applications:

``` text
GramHealthcare-/
├── frontend/
│   ├── package.json       # Frontend scripts and dependencies
│   └── ...                # React application and UI assets
├── backend/
│   ├── package.json       # Backend scripts and dependencies
│   ├── server.js          # Express server entry point
│   └── ...                # API routes and database-related code
└── README.md
```

This is a high-level map. The exact file and folder names may vary as
the project evolves.

## Getting Started

### Prerequisites

Install the following on a development computer or cloud development
environment:

-   Node.js (a current LTS release is recommended)
-   npm
-   MySQL server or an accessible MySQL database
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/codebyurvee/GramHealthcare-.git
cd GramHealthcare-
```

### 2. Configure the database

Create a MySQL database for the project. Use the database name and
connection settings expected by the backend code.

For example, in a MySQL client:

``` sql
CREATE DATABASE gramhealthcare;
```

If the application expects a different database name or schema, follow
the values and SQL files present in the repository. Create the required
tables before running workflows that depend on them.

### 3. Configure backend environment variables

Create a `backend/.env` file using the variable names read by the
backend source code. A typical configuration may look like this:

``` env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=gramhealthcare
```

**Important:** These names are examples, not a guarantee of the exact
variables used by the current server. Check `backend/server.js` and its
database connection code and use the variable names that the
implementation expects. Never commit real credentials or production
secrets.

### 4. Install and start the backend

Open a terminal:

``` bash
cd backend
npm install
npm run dev
```

The backend's `dev` script runs `node --watch server.js`. To start it
without watch mode:

``` bash
npm start
```

The actual port and available endpoints are determined by the backend
configuration.

### 5. Install and start the frontend

Open a second terminal from the repository root:

``` bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL in the terminal. Open that URL
in a browser.

### 6. Connect the frontend to the backend

If the frontend uses a configurable API base URL, set it using the
variable name expected by the Axios configuration. For Vite,
client-exposed environment variables commonly use the `VITE_` prefix,
for example:

``` env
VITE_API_BASE_URL=http://localhost:5000
```

This is an example only. Confirm the actual variable name and whether
the API path includes `/api` by inspecting the frontend's Axios setup
and the backend routes. Restart the Vite server after changing
environment variables.

## Environment Configuration

Keep local configuration in environment files and keep secrets out of
source control.

  Setting                   Purpose
  ------------------------- ------------------------------------
  Backend port              Port used by the Express server
  MySQL host and port       Location of the database server
  MySQL database name       Database used by the application
  MySQL username/password   Credentials used by the backend
  Frontend API base URL     Base address used for API requests

Use the precise variable names expected by the source code. Do not add
real credentials to this README or commit `.env` files.

## API and Data

The backend is an Express application and the backend dependencies
include `mysql2`, indicating a MySQL integration path.

For exact API documentation, inspect the route definitions and server
setup in `backend/`. When documenting or extending the API, record for
each endpoint:

-   HTTP method and path
-   Purpose
-   Required request fields
-   Successful response format
-   Validation and error responses
-   Authentication and role permissions, where implemented

Do not publish sample patient data or real personal health information
in documentation, screenshots, logs, or demo requests.

## Testing

The frontend `package.json` includes a `test` script that runs:

``` bash
npm test
```

This invokes `node test_member4.cjs` from the frontend directory. Check
that the referenced file exists and review its assertions to understand
exactly what is tested.

A production build can be checked with:

``` bash
cd frontend
npm run build
```

For a complete project check, also verify:

1.  The backend starts with the configured environment.
2.  The backend can connect to MySQL.
3.  The frontend can reach the configured API.
4.  Forms handle invalid input and API errors.
5.  Records persist after a page refresh.
6.  Referral and follow-up status changes behave as intended.
7.  Unauthorized requests are rejected by the server where
    authentication and authorization are implemented.

Only describe a test as passing after it has actually been run.

## Security and Responsible Use

Healthcare-related information is sensitive. Before using this project
with real patients:

-   Use fictional data for demos and judging.
-   Keep database credentials and other secrets out of Git.
-   Validate and normalize input on the server.
-   Use parameterized SQL queries.
-   Apply authentication and server-side authorization to protected
    routes.
-   Limit patient data to what is necessary for the workflow.
-   Avoid exposing personal or clinical details in logs and error
    messages.
-   Use HTTPS and appropriate database access controls in deployment.
-   Establish suitable consent, retention, backup, and access policies.
-   Do not treat the application as a diagnostic tool or emergency
    service.

These are responsible deployment requirements, not a claim that every
item is already implemented.

## Limitations and Future Improvements

Possible next steps for the project include:

-   Documenting every implemented API endpoint.
-   Adding automated tests for the main referral journey.
-   Improving input validation and error handling.
-   Verifying role-based access controls.
-   Adding deployment instructions and a public demo link, if deployed.
-   Adding screenshots or a short demo video to help judges review the
    experience.
-   Documenting the database schema and sample seed data, if present.
-   Improving low-connectivity behavior where appropriate.

## Team and Acknowledgements

Built as a healthcare-focused project to explore better coordination
between rural communities and healthcare services.

Add your team members, their roles, and any third-party services or
assets used before final submission.

## Disclaimer

GramHealthcare is a software project for demonstration and evaluation.
It does not replace professional medical advice, diagnosis, treatment,
or local emergency services. Use fictional data for public demos unless
appropriate safeguards and authorization are in place.


# User Management System

An Angular-based User Management application for viewing, searching, filtering, sorting, and managing employee records. The application uses a REST API powered by JSON Server to store and retrieve employee data.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Assumptions](#assumptions)

## Overview

The User Management System provides a centralized interface for managing employee information. It allows users to view employee records, search for specific employees, apply filters, and perform CRUD operations (Create, Read, Update, and Delete).

Employee records are stored in a JSON file and accessed through a REST API provided by JSON Server.

## Technologies Used

- **Angular** — Frontend application framework.
- **TypeScript** — Application logic and type safety.
- **HTML and CSS** — User interface and styling.
- **Angular Reactive Forms** — Form handling and validation.
- **JSON Server** — Mock REST API and data persistence.
- **Vitest** — Unit testing.

## Features

### Employee Management

- View a list of employee records.
- Add new employees.
- View individual employee details.
- Edit existing employee information.
- Delete employee records.

### Search and Filtering

- Search employees by name.
- Filter employees by department.
- Filter employees by employment status.
- Apply search and department filters together.

### Data Presentation

- Sort employee records by supported table columns.
- Display employee information in a structured table.
- Use pagination to navigate through employee records.

### Form Validation

- Require essential employee information.
- Validate employee names against minimum-length requirements.
- Validate email address formats.
- Prevent duplicate email addresses during employee creation or updates.

### Testing

- Verify that the application and employee component are created successfully.
- Test required-field and email validation.
- Test employee search and filtering functionality.

## Prerequisites

Before running the project, ensure the following are installed:

- [Node.js](https://nodejs.org/) and npm.
- [Angular CLI](https://angular.dev/tools/cli).
- A code editor such as Visual Studio Code.

Check your installed versions:

```bash
node -v
npm -v
ng version
```

## Setup and Installation

### 1. Clone or download the project

If the project is hosted in a Git repository:

```bash
git clone <repository-url>
cd User-Management
```

Alternatively, download and extract the project files, then open the project directory in your terminal.

### 2. Install dependencies

Run the following command from the project root:

```bash
npm install
```

### 3. Configure JSON Server

Install JSON Server if it is not already included in the project's dependencies:

```bash
npm install json-server
```

Ensure that a `db.json` file exists in the project root and contains an `employees` array.

Example:

```json
{
  "employees": [
    {
      "id": "EMP001",
      "Display_ID": "EMP001",
      "Name": "Jane Doe",
      "Email": "jane.doe@example.com",
      "Department": "IT",
      "Status": "Active"
    }
  ]
}
```

Each employee must have a unique `id` field for JSON Server to identify the record during update and delete operations.

### 4. Start the JSON Server

Open a terminal in the project root and run:

```bash
npx json-server db.json --port 3000
```

The employee API should be available at:

```text
http://localhost:3000/employees
```

Keep this terminal running while using the application.

### 5. Start the Angular application

Open a second terminal in the project root and run:

```bash
ng serve
```

Open the URL displayed in the terminal, typically:

```text
http://localhost:4200
```

The Angular application and JSON Server must both be running for employee data operations to work correctly.

## Running Tests

Run the unit test suite using:

```bash
ng test
```

The tests cover application and component creation, employee form validation, searching, and filtering.

The test runner uses Vitest in the current project setup. Ensure that tests reflect the application's current templates and behavior.

## Assumptions

- **Local development environment:** The application is intended to run locally during development.
- **Mock backend:** JSON Server is used as a lightweight REST API rather than a production backend.
- **API endpoint:** The application expects employee records at `http://localhost:3001/employees`.
- **Data structure:** Each employee contains an `id`, `Display_ID`, `Name`, `Email`, `Department`, and `Status`.
- **Unique identifiers:** Every employee has a unique `id` so records can be updated and deleted correctly.
- **Email uniqueness:** Employee email addresses should be unique. The frontend checks for duplicate emails, but a production backend should also enforce this rule.
- **Required fields:** Employee names, email addresses, departments, and statuses are expected to be provided when creating or editing records.
- **Employment status:** The supported statuses are `Active`, `Inactive`, and `On Leave`.
- **Department values:** Departments are selected from the values supported by the application's interface and employee data.
- **Authentication and authorization:** No authentication or role-based access control is assumed unless implemented separately.
- **Production readiness:** JSON Server is suitable for demonstration and development. A production deployment would require a secure backend, server-side validation, and appropriate data access controls.



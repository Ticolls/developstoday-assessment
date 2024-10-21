# Develops Today Assessment

## Project Structure

- `backend/`: Contains the backend API code built with **NestJS**.
- `frontend/`: Contains the frontend code built with **Next.js**.

## How to Run the Application

### 1. Clone the repository

First, clone the repository to your local environment:

```bash
git clone git@github.com:Ticolls/developstoday-assessment.git
cd developstoday-assessment
```

### 2. Backend Setup (NestJS)

#### 2.1 Navigate to the backend directory

```bash
cd backend
``` 
#### 2.2. Install dependencies
Install all the necessary dependencies:
```bash
npm install
``` 

#### 2.3. Configure environment variables
Create a .env file based on the provided .env.example file inside the backend folder:
```bash
cp .env.example .env
``` 

2.4. Run the backend server
Once the environment variables are set, start the backend server with:
```bash
npm run start:dev
``` 
The backend server will now be running on http://localhost:8080.

### 3. Frontend Setup (Next.js)
#### 3.1. Navigate to the frontend directory
Go back to the root directory and move into the frontend folder:
```bash
cd ../frontend
``` 

#### 3.2. Install dependencies
Install all the necessary frontend dependencies:
```bash
npm install
``` 

#### 3.3. Configure environment variables
Create a .env file based on the provided .env.example file inside the frontend folder:
```bash
cp .env.example .env.local
``` 

#### 3.4. Run the frontend server
Once the environment variables are set, start the frontend server with:
```bash
npm run dev
``` 
The frontend will now be running on http://localhost:3000.
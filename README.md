# Mini E-Learning Platform

This project is a **Next.js** and **NestJS**-powered e-learning platform featuring user authentication, course management, and OAuth integration.

Frontend live link : https://e-learning-mini.vercel.app

Frontend Repo link : https://github.com/usmanahmedgoraya/min-e-learning.git

backend live link Swagger : https://mini-e-learning-backend.vercel.app/api

backend repo link : https://github.com/usmanahmedgoraya/mini-e-learning-backend

---

## 🚀 Features

### 🌐 Frontend (Next.js)
- **User Authentication**:
  - Email/password signup with **OTP verification**.
  - Login with JWT token.
  - Password reset via OTP.
  - **Social login** (Google & GitHub).
- **Course Management**:
  - CRUD operations for courses.
  - Featured & new courses sections.
  - Category filtering.
  - Slug-based URLs.
- **UI Components**:
  - Navbar with responsive design.
  - Featured courses section.
  - Search & filter functionality.
  - Detailed course pages.
- **Additional Features**:
  - Contact Us page with form submission.

### 🔥 Backend (NestJS)
- **MongoDB Database** with Mongoose.
- **Authentication** using JWT & OAuth.
- **Email Verification & OTP for Password Reset** (Nodemailer).
- **Swagger UI** for API documentation.
- **Admin Features**:
  - View all users.
  - Manage courses.

---

## 📦 Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- React Hook Form & Zod (for validation)
- Redux Toolkit & React Query (for state management)

### Backend
- NestJS
- MongoDB & Mongoose
- Passport.js for authentication (JWT & OAuth)
- Nodemailer for email services
- Swagger for API documentation

---

## 🛠️ Local Setup Instructions

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **MongoDB Atlas** account or local MongoDB instance
- **Google OAuth & GitHub OAuth** credentials
- **Gmail account** for email service
- 



### Installation

#### 1️⃣ Clone the Repository

```sh
git clone https://github.com/usmanahmedgoraya/min-e-learning.git
cd min-e-learning
```

#### 2️⃣ Install Dependencies

```sh
npm install
# or
yarn install
```

#### 3️⃣ Set Up Environment Variables

Create a `.env.local` file in the root directory for the frontend.

Create a `.env` file for the backend with:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/dbname?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_SECRET=your_github_secret

# Email
HOST=smtp.gmail.com
PORT=465
SERVICE=gmail
USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

#### 4️⃣ Start the Development Server

```sh
npm run dev
# or
yarn dev
```

Frontend will run on `http://localhost:3000/`  
Backend will run on `http://localhost:3001/`

#### 5️⃣ Build for Production (Optional)

```sh
npm run build
npm run start
```

---

## 🔌 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/signup`          | Register new user (sends OTP)        |
| POST   | `/verify-email`    | Verify email with OTP                |
| POST   | `/login`           | User login                           |
| POST   | `/password`        | Request password reset OTP           |
| POST   | `/verify-reset-otp`| Verify password reset OTP            |
| PUT    | `/reset-password`  | Reset password with verified OTP     |
| POST   | `/resend-otp`      | Resend verification OTP              |
| GET    | `/google`          | Initiate Google OAuth flow           |
| GET    | `/google/redirect` | Google OAuth callback                |
| GET    | `/github`          | Initiate GitHub OAuth flow           |
| GET    | `/github/redirect` | GitHub OAuth callback                |

### Courses (`/courses`)

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/`                | Create new course                    |
| GET    | `/`                | Get all courses                      |
| GET    | `/featured`        | Get featured courses                 |
| GET    | `/new`             | Get newest courses                   |
| GET    | `/categories`      | Get all course categories            |
| GET    | `/:id`             | Get course by ID                     |
| GET    | `/slug/:slug`      | Get course by slug                   |
| PUT    | `/:id`             | Update course                        |
| DELETE | `/:id`             | Delete course                        |

---

## 🏗️ Deployment

1. **Frontend Deployment on Vercel**  
   - Connect your GitHub repository.
   - Add environment variables.
   - Deploy!

2. **Backend Deployment on Vercel or Heroku**  
   - Set up MongoDB database.
   - Configure OAuth credentials.
   - Add email credentials.

3. **Environment Variables for Production**  
   Ensure these are set in your hosting provider:
   - `MONGO_URI`
   - `JWT_SECRET`
   - OAuth credentials
   - Email credentials
   - Frontend/backend URLs

---

## 🔐 Security Considerations

1. Use **HTTPS** in production.
2. Keep secrets **out of version control**.
3. Rotate **JWT secrets** regularly.
4. Implement **rate limiting** for auth endpoints.
5. **Keep dependencies updated**.


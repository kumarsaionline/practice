# Todo List Application

A full-stack todo list application built with React and Node.js featuring JWT authentication, task management, and a responsive design.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Categories**: Organize tasks by custom categories
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Due Dates**: Set and track task due dates
- **Status Tracking**: Track task progress (Pending, In Progress, Completed)
- **Search & Filter**: Find tasks by title, description, status, or priority
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Copy environment file and configure
   copy .sample.env .env
   # Edit .env file with your MongoDB URI and JWT secret
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todolist
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

## Usage

1. **Sign Up**: Create a new account or log in to an existing one
2. **Add Tasks**: Click "Add Task" to create new todos with details
3. **Manage Tasks**: View all tasks, update status, edit, or delete them
4. **Filter & Search**: Use filters to find specific tasks quickly
5. **Track Progress**: Monitor task completion and overdue items

## Project Structure

```
├── Backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── AddTask.jsx
    │   │   └── ViewTasks.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
## Real-Time Chat Application

## Overview

This Real-Time Chat Application allows users to communicate with each other in  
specific chat rooms after logging in. The application features user authentication,
chat room management, and message persistence, all built using modern 
technologies and clean architecture principles.

## Key Features

- **User Authentication**: Users can register and log in to access the chat interface.
- **JWT Token Utilization**: JSON Web Tokens (JWT) are used for secure authentication. After logging in, the token is stored and sent with every request in the Authorization header.
- **Clean Architecture**: The project is structured using clean architecture principles, making it easy to maintain and extend.
- **Redis for Active Rooms**: Redis is utilized to manage active chat rooms, allowing for efficient room management and quick access to active sessions.
- **PostgreSQL for Message Storage**: All messages are stored in a PostgreSQL database for permanent storage, ensuring that users can access their chat history.
- **Search Functionality**: Users can search through messages in specific rooms, enhancing the usability of the chat application.
- **Room Management**: Users can create new chat rooms and set passwords for private rooms, allowing for secure and private conversations.
- **Frontend**: The frontend is built using plain HTML, CSS, and JavaScript, providing a simple and responsive user interface.

## Technologies Used

- **Backend**: Node.js, Express.js
- Frontend: Vue.js, Socket.io
- **Database**: PostgreSQL for message storage
- **Caching**: Redis for managing active chat rooms
- **Authentication**: JSON Web Tokens (JWT)
- **Frontend**: HTML, CSS, JavaScript

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL
- Redis
- A package manager like npm or yarn

### Installation

1. **Clone the Repository**:

```bash
git clone https://github.com/leodahal4/chat-app.git
cd chat-app
```

2. Install Dependencies:

```bash
npm install
```

3. Set Up Environment Variables:  
Create a .env file in the root directory and add the following variables:

```
DATABASE_URL=your_postgres_database_url
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Initialize the Database:  
Make sure to create the necessary tables in your PostgreSQL database.
You can use the following SQL commands:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    room_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Start the Application:

```bash
npm start
```
The application will be running on http://localhost:3000.

### Frontend Access
You can access the frontend by navigating to the following URLs:
```
    Login Page: http://localhost:3000/login.html
    Registration Page: http://localhost:3000/register.html
    Chat Page: http://localhost:3000/chat.html
```

### Usage
```
    Register: Create a new account using the registration page.
    Login: Log in using your credentials.
    Chat Rooms: After logging in, you can create new chat rooms or join existing ones. You can also set passwords for private rooms.
    Messaging: Send and receive messages in real-time.
    Search: Use the search functionality to find specific messages in the chat rooms.
    Logout: You can log out to end your session.
```

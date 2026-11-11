# Lending Library - Frontend UI

Modern React frontend built with **React**, **TypeScript**, and **Vite**, designed to interact with the Spring Boot backend and FastAPI AI microservice in a microservices architecture.

## 🚀 Technologies Used
* **React**
* **TypeScript**
* **Vite** (Build tool & dev server)
* **CSS / Styling**

## 📁 Project Components & Structure
```text
src/
├── assets/             # Images, icons, and static assets
├── components/         # UI Components
│   ├── AIRecommendations.tsx  # Displays AI-powered book recommendations
│   ├── BookList.tsx           # Browse and search library books
│   ├── Login.tsx              # User authentication login view
│   ├── Register.tsx           # New user registration view
│   ├── Reservation.tsx        # Book borrowing and reservation management
│   └── UserList.tsx           # User management view
├── App.tsx             # Root component with routing/layout
├── App.css             # Application styles
└── main.tsx            # Application entry point
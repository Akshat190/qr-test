# QR Menu System

A modern digital menu system that allows restaurants to create QR code-based menus and manage orders efficiently.

## 🚀 Features

### For Restaurant Owners
- 📱 Digital Menu Management
- 🔄 Real-time Order Updates
- 📊 Sales Analytics
- 💳 Revenue Tracking
- 🎨 Customizable Menu Design
- 🔐 Secure Authentication

### For Customers
- 📱 Easy QR Code Scanning
- 🛒 Seamless Ordering
- 💳 Secure Payments
- 📋 Order History
- ⭐ Rating System

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Zustand
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Mongoose
- Nodemailer

## 🏗️ Project Structure
/
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── store/
│ │ └── utils/
│ ├── package.json
│ └── README.md
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ └── utils/
│ ├── package.json
│ └── README.md
│
└── README.md


## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Frontend Setup

bash
cd frontend
npm install
npm run dev

### Backend Setup

bash
cd backend
npm install
npm run dev
### Environment Variables

#### Frontend (.env)
VITE_API_URL=http://localhost:5000/api


#### Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173



## 📱 Usage

1. Restaurant owners register and create their digital menu
2. Generate unique QR code for the menu
3. Customers scan QR code to view menu and place orders
4. Restaurant receives orders in real-time
5. Track orders, revenue, and analytics through dashboard

## 🔒 Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Input Validation
- Error Handling

## 📝 API Documentation

### Auth Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/reset-password` - Reset password

### Menu Routes
- GET `/api/menu` - Get restaurant menu
- POST `/api/menu` - Create menu item
- PUT `/api/menu/:id` - Update menu item
- DELETE `/api/menu/:id` - Delete menu item

### Order Routes
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get restaurant orders
- PATCH `/api/orders/:id` - Update order status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Authors

- **Your Name** - *Initial work* - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
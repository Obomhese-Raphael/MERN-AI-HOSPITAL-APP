# TeleCare Hub 🏥

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-ISC-yellow" alt="License">
  <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node.js">
  <img src="https://img.shields.io/badge/React-19.0.0-blue" alt="React">
</div>

## 🚀 Overview

TeleCare Hub is a cutting-edge AI-driven hospital management platform that revolutionizes healthcare workflows through intelligent automation. Our platform seamlessly integrates Vapi-powered voice agents for natural patient interactions and Clerk for enterprise-grade authentication, delivering a comprehensive solution for modern healthcare facilities.

### ✨ Key Features

- **🎙️ AI Voice Agents**: Vapi-powered conversational AI for patient interactions
- **📅 Smart Appointment Scheduling**: AI-assisted booking and management system
- **🔐 Secure Authentication**: Clerk-powered user management and access control
- **🩺 Medical Inquiry System**: Intelligent patient query handling
- **📊 Patient Management**: Comprehensive patient data organization
- **🌐 Full-Stack Solution**: Complete frontend and backend architecture
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS

## 🏗️ Architecture

```
TeleCare Hub/
├── frontend/          # React 19 + Vite application
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json / .env
├── backend/           # Node.js + Express server
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
│   └── utils/
│   └── .env
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Next-generation build tool
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Clerk** - Authentication and user management
- **Vapi AI** - Voice interaction capabilities

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **OpenAI** - AI/ML capabilities
- **JWT** - JSON Web Tokens for auth
- **Bcrypt** - Password hashing

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **GitHub** - Version control and CI/CD
- **ESLint** - Code quality and consistency

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB database
- Clerk account for authentication
- Vapi AI account for voice features
- OpenAI API key (Optional)

### Installation

1. **Clone the repository**
```bash
git clone [https://github.com/yourusername/telecare-hub.git](https://github.com/Obomhese-Raphael/MERN-AI-HOSPITAL-APP.git)
ls (Check out all the files under the folder) 
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Configuration**

Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key (Optional)
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
VITE_VAPI_PUBLIC_KEY=Your actual public key
FRONTEND_URL=http://localhost:5173
VAPI_ORG_ID=your vapi org id (settings in the Vapi website) 
VAPI_PRIVATE_KEY=your_vapi_private_key
VAPI_PUBLIC_KEY=your_vapi_public_key
```

**Frontend (.env)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_API_BASE_URL_DEV=http://localhost:5000
VITE_API_BASE_URL=
VITE_VAPI_ASSISTANT_ID=
```

5. **Start the development servers**

Backend:
```bash
cd backend
npm run server
```

Frontend:
```bash
cd frontend
npm run dev
```

## 📋 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run server` - Start development server with nodemon
- `npm test` - Run Jest tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Clerk Setup
1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your authentication providers
3. Add your publishable key to frontend environment variables
4. Set up webhooks for user synchronization

### Vapi AI Setup
1. Sign up at [vapi.ai](https://vapi.ai)
2. Create your voice agent configuration
3. Add your API key to frontend environment variables

### MongoDB Setup
1. Create a MongoDB cluster (MongoDB Atlas recommended)
2. Configure database user and network access
3. Add connection string to backend environment variables

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Hosting
Recommended platforms:
- **Railway** - Simple Node.js deployment
- **Render** - Full-stack hosting
- **Heroku** - Classic PaaS solution

## 📊 Features Overview

### Patient Management
- **Registration & Authentication** via Clerk
- **Voice-based Interactions** powered by Vapi AI
- **Appointment Scheduling** with AI assistance
- **Medical Record Management**
- **Real-time Notifications**

### Healthcare Provider Tools (UPCOMING 🔜)
- **Dashboard Analytics**
- **Patient Communication Hub**
- **Appointment Calendar**
- **Medical Inquiry Management**
- **Workflow Automation**

### AI Capabilities
- **Natural Language Processing** for patient queries
- **Voice Recognition** for hands-free interaction
- **Intelligent Scheduling** based on availability
- **Medical Information Retrieval**
- **Automated Response Generation**

## 🔐 Security Features

- **End-to-end Encryption** for sensitive data
- **JWT Token Authentication**
- **Role-based Access Control**
- **Secure API Endpoints**
- **Input Validation** and sanitization

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation for new features
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vapi AI](https://vapi.ai) for voice interaction capabilities
- [Clerk](https://clerk.com) for authentication services
- [OpenAI](https://openai.com) for AI/ML capabilities
- [MongoDB](https://mongodb.com) for database solutions
- [Vercel](https://vercel.com) for hosting services

## 📞 Support

For support, questions, or feedback:
- 📧 Email: obomheser@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/obomhese-raphael/telecare-hub/issues)

---

<div align="center">
  <p>Built with ❤️ for the healthcare community</p>
  <p>© 2025 TeleCare Hub. All rights reserved.</p>
</div>

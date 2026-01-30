import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks } from "./controllers/webhookController.js";
import contactRouter from "./routes/contactRoute.js";
import newsletterRoute from "./routes/newsLeterRoute.js";
import vapiRoute from "./routes/vapi.js";

const app = express();

// ✅ Connect to MongoDB (but don't let it block the app)
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
  // Continue anyway - VAPI routes don't need MongoDB
});

// ✅ FIX: Allow GET requests and more origins
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Alternative port
      "https://ai-hospital-app.vercel.app/", // Add your deployed frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Added GET!
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Clerk webhook needs raw body
app.use("/api/clerk", express.raw({ type: "application/json" }));

// Parse JSON for other routes
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "BACKEND API IS RUNNING",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.post("/webhooks", clerkWebhooks);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRoute);
app.use("/api/vapi", vapiRoute);

// ✅ 404 handler for debugging
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: "Route not found",
    method: req.method,
    path: req.path 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 VAPI routes: /api/vapi`);
  console.log(`🔑 VAPI_PRIVATE_KEY: ${process.env.VAPI_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);
});
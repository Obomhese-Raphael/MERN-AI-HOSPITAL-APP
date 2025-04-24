import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/mongodb.js';
import { clerkWebhooks } from './controllers/webhookController.js';
import contactRouter from './routes/contactRoute.js';
import newsletterRoute from './routes/newsLeterRoute.js';

const app = express();
connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
    ],
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/clerk", express.raw({ type: "application/json" }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('BACKEND API IS RUNNING');
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
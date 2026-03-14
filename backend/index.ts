import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import mongoose from "mongoose";
import Otp from "./models/Otp";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/bulksms")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Helper: send SMS via AdvantaSMS
interface SendSmsParams {
  mobilePhone: string;
  smsText: string;
}

async function sendSMS({ mobilePhone, smsText }: SendSmsParams) {
  const SMS_URL = process.env.ADVANTA_SMS_URL;
  const API_KEY = process.env.ADVANTA_API_KEY;
  const PARTNER_ID = process.env.ADVANTA_PARTNER_ID;
  const SHORTCODE = process.env.ADVANTA_SHORTCODE || "CONNECT";

  if (!SMS_URL || !API_KEY) {
    throw new Error("Missing required SMS configuration (ADVANTA_SMS_URL or ADVANTA_API_KEY)");
  }

  // Robust detection: Use Tiara format if URL contains "tiara" OR if no Partner ID is provided
  const isTiara = SMS_URL.toLowerCase().includes("tiara") || !PARTNER_ID || PARTNER_ID.trim() === "";

  if (isTiara) {
    // TiaraConnect Format
    const body = {
      from: SHORTCODE,
      to: mobilePhone,
      message: smsText,
    };

    return axios.post(SMS_URL, body, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
    });
  } else {
    // AdvantaSMS / Legacy Format
    const body = {
      apikey: API_KEY,
      partnerID: PARTNER_ID,
      message: smsText,
      shortcode: SHORTCODE,
      mobile: mobilePhone,
    };

    return axios.post(SMS_URL, body, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Step 1: Generate OTP
app.post("/request-otp", async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await Otp.create({ phone, code: otpCode, expiresAt: expiry });

  try {
    await sendSMS({
      mobilePhone: phone,
      smsText: `Your OTP code is ${otpCode}. Valid for 10 minutes.`,
    });
    res.json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    console.error("Failed to send OTP:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Step 2: Verify OTP
app.post("/verify-otp", async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

  const record = await Otp.findOne({ phone, code: otp });
  if (!record) return res.status(400).json({ error: "Invalid OTP" });

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ error: "OTP expired" });
  }

  await Otp.deleteOne({ _id: record._id });

  // TODO: issue JWT or session token here
  res.json({ success: true, message: "OTP verified. Redirect to dashboard." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  code: string;
  expiresAt: Date;
}

const otpSchema: Schema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete after expiry

const Otp: Model<IOtp> = mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;

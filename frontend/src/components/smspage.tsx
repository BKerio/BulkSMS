import { useState } from "react";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

export default function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [message, setMessage] = useState("");

  const requestOtp = async () => {
    const res = await fetch(`${BACKEND_API_URL}/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (data.success) setStep("verify");
  };

  const verifyOtp = async () => {
    const res = await fetch(`${BACKEND_API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (data.success) {
      // 🚀 Redirect to dashboard
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4"> Login with OTP</h1>

      {step === "request" && (
        <>
          <input
            type="text"
            placeholder="Enter phone (e.g. 0718607342)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={requestOtp} className="bg-blue-600 text-white px-4 py-2 rounded">
            Request OTP
          </button>
        </>
      )}

      {step === "verify" && (
        <>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={verifyOtp} className="bg-green-600 text-white px-4 py-2 rounded">
            Verify OTP
          </button>
        </>
      )}

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

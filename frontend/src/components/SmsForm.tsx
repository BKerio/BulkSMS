// import React, { useState } from "react";
// import { sendSms } from "@/api";

// const SmsForm: React.FC = () => {
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus("⏳ Sending...");
//     try {
//       const res = await sendSms(phone, message);
//       setStatus(`✅ Sent: ${JSON.stringify(res)}`);
//       setPhone("");
//       setMessage("");
//     } catch (err) {
//       setStatus("❌ Failed to send SMS");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg">
//       <h2 className="text-xl font-bold mb-4">Send SMS</h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           placeholder="Phone number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="border p-2 w-full rounded"
//           required
//         />
//         <textarea
//           placeholder="Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="border p-2 w-full rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </form>
//       {status && <p className="mt-3 text-sm">{status}</p>}
//     </div>
//   );
// };

// export default SmsForm;

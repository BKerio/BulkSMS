import axios from "axios";
import "dotenv/config";

/**
 * Robust SMS test script that detects the provider (Advanta/Tiara)
 * and uses the correct authentication and body format.
 */
async function testSms() {
  const url = process.env.ADVANTA_SMS_URL || "";
  const apiKey = process.env.ADVANTA_API_KEY || "";
  const partnerID = process.env.ADVANTA_PARTNER_ID || "";
  const shortcode = process.env.ADVANTA_SHORTCODE || "CONNECT";
  const mobile = "+254717000480"; // Replace with your actual number to test
  const message = "Hello! Test message from BulkSMS multi-provider script.";

  console.log("-----------------------------------------");
  console.log("Starting SMS API Test");
  console.log("URL:", url);
  console.log("Mobile:", mobile);

  if (!url || !apiKey) {
    console.error("Error: Missing ADVANTA_SMS_URL or ADVANTA_API_KEY in .env");
    return;
  }

  // Detection Logic (Same as index.ts)
  const isTiara = url.toLowerCase().includes("tiara") || !partnerID || partnerID.trim() === "";

  if (isTiara) {
    console.log("Detected Mode: TiaraConnect (Modern)");
    console.log("Format: { from, to, message } with Bearer Token");
  } else {
    console.log("Detected Mode: AdvantaSMS / Paramount (Legacy)");
    console.log("Format: { apikey, partnerID, shortcode, mobile, message }");
  }
  console.log("-----------------------------------------");

  try {
    console.log("Sending request...");
    let response;

    if (isTiara) {
      response = await axios.post(url, {
        from: shortcode,
        to: mobile,
        message: message
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
    } else {
      response = await axios.post(url, {
        apikey: apiKey,
        partnerID: partnerID,
        message: message,
        shortcode: shortcode,
        mobile: mobile,
      }, {
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("Success!");
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error("Request Failed");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
  }
  console.log("-----------------------------------------");
}

testSms();

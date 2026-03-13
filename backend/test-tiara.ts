import axios from "axios";
import "dotenv/config";

/**
 * standalone script to test the TiaraConnect API integration.
 * Run this with: npx tsx test-tiara.ts
 */
async function testTiara() {
  const url = process.env.ADVANTA_SMS_URL || "";
  const apiKey = process.env.ADVANTA_API_KEY || "";
  const shortcode = process.env.ADVANTA_SHORTCODE || "CONNECT";
  const mobile = "+254712345678"; // Replace with your actual phone number to receive the test SMS
  const message = "Hello! This is a test message from your BulkSMS TiaraConnect integration.";

  console.log("-----------------------------------------");
  console.log("Starting TiaraConnect API Test");
  console.log("URL:", url);
  console.log("Mobile:", mobile);
  console.log("-----------------------------------------");
  
  if (!url || !apiKey) {
    console.error("Error: Missing ADVANTA_SMS_URL or ADVANTA_API_KEY in .env file.");
    return;
  }

  try {
    console.log("Sending request...");
    const response = await axios.post(url, {
      from: shortcode,
      to: mobile,
      message: message
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

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

testTiara();

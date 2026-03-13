import axios from "axios";
import "dotenv/config";

async function testTiara() {
  const url = process.env.ADVANTA_SMS_URL || "";
  const apiKey = process.env.ADVANTA_API_KEY || "";
  const shortcode = process.env.ADVANTA_SHORTCODE || "";
  const mobile = "+254717000480";
  const message = "Test OTP from TiaraConnect integration";

  console.log("Testing TiaraConnect API...");
  console.log("URL:", url);
  
  // Try format 1: Bearer token + from/to/message
  try {
    console.log("Trying Format 1: Bearer token + {from, to, message}");
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
    console.log("Success Format 1:", response.data);
    return;
  } catch (error: any) {
    console.error("Failed Format 1:", error.response?.status, error.response?.data || error.message);
  }

  // Try format 2: X-API-Key + from/to/message
  try {
    console.log("Trying Format 2: X-API-Key + {from, to, message}");
    const response = await axios.post(url, {
      from: shortcode,
      to: mobile,
      message: message
    }, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json"
      }
    });
    console.log("Success Format 2:", response.data);
    return;
  } catch (error: any) {
    console.error("Failed Format 2:", error.response?.status, error.response?.data || error.message);
  }

  // Try format 3: apikey in body (old format) but with new keys
  try {
    console.log("Trying Format 3: apikey in body + {shortcode, mobile, message}");
    const response = await axios.post(url, {
      apikey: apiKey,
      shortcode: shortcode,
      mobile: mobile,
      message: message
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("Success Format 3:", response.data);
    return;
  } catch (error: any) {
    console.error("Failed Format 3:", error.response?.status, error.response?.data || error.message);
  }
}

testTiara();

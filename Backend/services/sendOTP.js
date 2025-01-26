const axios = require("axios"); // Import the axios library for making HTTP requests

// Function to send OTP (One Time Password) via SMS
const sendOtp = async (phone, otp) => {
  let isSent = false; // Flag to track if the OTP was successfully sent
  const url = "https://api.managepoint.co/api/sms/send"; // API endpoint for sending SMS

  // Payload contains the API key, recipient's phone number, and the message with the OTP
  const payload = {
    apiKey: process.env.API_KEY, // API key stored in environment variables for security
    to: phone, // Recipient's phone number
    message: `Your verification code is ${otp}`, // SMS message with the OTP
  };

  try {
    // Send a POST request to the SMS API with the payload
    const res = await axios.post(url, payload);
    if (res.status === 200) { // Check if the response status is 200 (OK)
      isSent = true; // If successful, set isSent to true
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.log("Error Sending OTP", error.message);
  }

  return isSent; // Return whether the OTP was successfully sent
};

module.exports = sendOtp; // Export the sendOtp function for use in other parts of the application

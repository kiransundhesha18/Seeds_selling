const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
  console.warn("Razorpay keys are missing in environment variables. Set RAZORPAY_API_KEY and RAZORPAY_API_SECRET.");
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "dummy_key",
  key_secret: process.env.RAZORPAY_API_SECRET || "dummy_secret",
});

module.exports = razorpayInstance;

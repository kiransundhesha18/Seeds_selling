const express = require("express");
const {
  submitContactMessage,
  getAllContactMessages,
  markMessageAsRead,
  deleteMessage,
} = require("../controllers/contactController");

// We would typically apply requireSignIn and isAdmin middleware for admin routes
// but I have to verify if they are available in middleware/authMiddleware.js
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// User Route: submit contact message
router.post("/api/contact", submitContactMessage);

// Public route for debugging (remove in production)
router.get("/api/admin/contact/public", getAllContactMessages);

router.get("/api/admin/contact", authMiddleware, adminMiddleware, getAllContactMessages);
router.put("/api/admin/contact/:id/read", authMiddleware, adminMiddleware, markMessageAsRead);
router.delete("/api/admin/contact/:id", authMiddleware, adminMiddleware, deleteMessage);

module.exports = router;

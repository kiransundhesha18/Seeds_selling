const ContactModel = require("../models/ContactModel");

// Submit a new contact message
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Server-side validation for the Message field
    if (message.trim().length < 10) {
      return res.status(400).send({
        success: false,
        message: "Minimum message length should be at least 10 characters.",
      });
    }

    const messageRegex = /^[a-zA-Z0-9 \s@.,!?&'"()-]+$/;
    if (!messageRegex.test(message)) {
      return res.status(400).send({
        success: false,
        message: "Invalid characters are not allowed in the message.",
      });
    }

    const contact = new ContactModel({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    res.status(201).send({
      success: true,
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in sending message",
      error: error.message,
    });
  }
};

// Get all contact messages for admin
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactModel.find({}).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: messages.length,
      message: "All contact messages",
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting messages",
      error: error.message,
    });
  }
};

// Mark a message as read
const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactModel.findByIdAndUpdate(
      id,
      { status: "Read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).send({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Message marked as read",
      updatedMessage: message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while marking message as read",
      error: error.message,
    });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactModel.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).send({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting message",
      error: error.message,
    });
  }
};

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  markMessageAsRead,
  deleteMessage,
};

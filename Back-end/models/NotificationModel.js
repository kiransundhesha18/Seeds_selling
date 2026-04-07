const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["order", "cancelled", "user_update", "low_stock"], 
      required: true 
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: false },
    onModel: { type: String, required: false, enum: ['Order', 'User', 'Product'] },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// TTL index: automatically delete documents 24 hours after `createdAt`
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'item_pending',
      'item_moderated',
      'message',
      'item_update',
      'rental_request',
      'rental_update',
      'rental_complete',
      'rental_extension',
      'admin_notice',
      'wishlist_update'
    ],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); 

export default mongoose.model("Notification", notificationSchema); 
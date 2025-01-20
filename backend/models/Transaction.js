import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'rental', 'donation'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled', 'in_progress'],
    default: 'pending'
  },
  price: Number,
  rentalDetails: {
    durationType: {
      type: String,
      enum: ['hour', 'day', 'week'],
      required: function() {
        return this.type === 'rental';
      }
    },
    duration: {
      type: Number,
      required: function() {
        return this.type === 'rental';
      }
    },
    pricePerUnit: {
      type: Number,
      required: function() {
        return this.type === 'rental';
      }
    },
    startDate: Date,
    endDate: Date,
    deposit: Number,
    terms: String,
    totalPrice: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  notes: String
}, { 
  timestamps: true 
});

// Add indexes for better query performance
transactionSchema.index({ seller: 1, status: 1 });
transactionSchema.index({ buyer: 1, status: 1 });
transactionSchema.index({ item: 1 });

export default mongoose.model("Transaction", transactionSchema); 
const mongoose = require('mongoose');

const subscriptionPlanSchema = mongoose.Schema(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      enum: ['basic', 'standard', 'premium'],
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    offers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
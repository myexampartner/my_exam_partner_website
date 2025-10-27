import mongoose from 'mongoose';

const PricingPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  features: [{
    type: String,
    required: true,
  }],
  gradient: {
    type: String,
    default: "linear-gradient(135deg, #1a1a1a, #000000)",
  },
  textColor: {
    type: String,
    default: "white",
  },
  tagBg: {
    type: String,
    default: "rgba(255, 255, 255, 0.2)",
  },
  tagColor: {
    type: String,
    default: "#fff",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.PricingPlan || mongoose.model('PricingPlan', PricingPlanSchema);

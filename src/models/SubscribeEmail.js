import mongoose from 'mongoose';

const subscribeEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  },
  source: {
    type: String,
    default: 'website_footer'
  },
  ipAddress: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
subscribeEmailSchema.index({ email: 1 });
subscribeEmailSchema.index({ status: 1 });
subscribeEmailSchema.index({ subscribedAt: -1 });

export default mongoose.models.SubscribeEmail || mongoose.model('SubscribeEmail', subscribeEmailSchema);

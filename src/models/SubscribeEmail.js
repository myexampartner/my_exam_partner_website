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
  },
  // Email send tracking
  lastEmailSentAt: {
    type: Date,
    default: null
  },
  emailSendCount: {
    type: Number,
    default: 0
  },
  emailSendStatus: {
    type: String,
    enum: ['not_sent', 'sent', 'failed', 'sending'],
    default: 'not_sent'
  },
  emailSendHistory: [{
    templateId: {
      type: String,
      required: true
    },
    templateName: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'delivered', 'opened'],
      default: 'sent'
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
subscribeEmailSchema.index({ email: 1 });
subscribeEmailSchema.index({ status: 1 });
subscribeEmailSchema.index({ subscribedAt: -1 });
subscribeEmailSchema.index({ lastEmailSentAt: -1 });
subscribeEmailSchema.index({ emailSendCount: -1 });
subscribeEmailSchema.index({ emailSendStatus: 1 });

export default mongoose.models.SubscribeEmail || mongoose.model('SubscribeEmail', subscribeEmailSchema);

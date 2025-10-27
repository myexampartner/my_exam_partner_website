import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  curriculum: {
    type: String,
    required: true,
    trim: true,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'enrolled', 'rejected'],
    default: 'pending',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);

import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    maxlength: [200, 'Qualification cannot exceed 200 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    maxlength: [50, 'Experience cannot exceed 50 characters']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  image: {
    public_id: {
      type: String,
      default: 'placeholder'
    },
    url: {
      type: String,
      default: '/images/tutor1.png'
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  specialization: {
    type: [String],
    default: []
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'flexible'],
    default: 'flexible'
  },
  hourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative']
  },
  languages: {
    type: [String],
    default: ['English']
  },
  certifications: {
    type: [String],
    default: []
  },
  teachingMethods: {
    type: [String],
    default: []
  },
  studentCount: {
    type: Number,
    default: 0,
    min: [0, 'Student count cannot be negative']
  },
  successRate: {
    type: Number,
    default: 0,
    min: [0, 'Success rate cannot be less than 0'],
    max: [100, 'Success rate cannot be more than 100']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: {
    type: [String],
    default: []
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    website: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Pakistan'
    },
    zipCode: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branchCode: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
tutorSchema.index({ subject: 1 });
tutorSchema.index({ status: 1 });
tutorSchema.index({ rating: -1 });

// Virtual for full name
tutorSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to update last active
tutorSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Method to increment student count
tutorSchema.methods.incrementStudentCount = function() {
  this.studentCount += 1;
  return this.save();
};

// Method to update rating
tutorSchema.methods.updateRating = function(newRating) {
  this.rating = newRating;
  return this.save();
};

// Static method to find active tutors
tutorSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find tutors by subject
tutorSchema.statics.findBySubject = function(subject) {
  return this.find({ subject: subject, status: 'active' });
};

// Static method to get top rated tutors
tutorSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ status: 'active' }).sort({ rating: -1 }).limit(limit);
};

// Pre-save middleware to update lastActive
tutorSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

const Tutor = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);

export default Tutor;

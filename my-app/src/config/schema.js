import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Only require password if googleId is not present
      return !this.googleId;
    }
  },
  role: {
    type: String,
    required: true,
    default: 'Volunteer',
    enum: ['Volunteer', 'Admin']
  },
  profileImage: {
    type: String,
    default: '/default-avatar.png'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending', 'Blocked'],
    default: 'Pending'
  },
  // Role-specific fields
  volunteer: {
    interests: [String],
    skills: [String],
    availability: {
      type: String,
      enum: ['Weekdays', 'Weekends', 'Flexible']
    },
    hoursContributed: {
      type: Number,
      default: 0
    }
  },
  organization: {
    name: String,
    type: String,
    registrationNumber: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending'
    }
  },
  government: {
    department: String,
    jurisdiction: String,
    position: String,
    employeeId: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  notifications: [{
    type: {
      type: String,
      enum: ['Project', 'Message', 'Update', 'Alert']
    },
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  resetToken: String,
  resetTokenExpiry: Date,
  googleId: {
    type: String,
    sparse: true
  },
}, {
  timestamps: true
});

// Project Schema
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    short: {
      type: String,
      required: true,
      maxlength: 200
    },
    detailed: {
      type: String,
      required: true
    }
  },
  category: [{
    type: String,
    enum: [
      'Environment',
      'Healthcare',
      'Education',
      'Community',
      'Technology',
      'Arts',
      'Sports',
      'Emergency Response'
    ],
    required: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: {
        type: Boolean,
        default: false
      }
    }]
  },
  requirements: {
    volunteersNeeded: Number,
    skills: [String],
    resources: [{
      item: String,
      quantity: Number,
      acquired: {
        type: Number,
        default: 0
      }
    }]
  },
  team: {
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    volunteers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String,
      joinedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
      }
    }]
  },
  status: {
    type: String,
    enum: ['Draft', 'Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Invitation'],
    default: 'Public'
  },
  media: {
    images: [String],
    videos: [String],
    documents: [String]
  },
  impactMetrics: {
    volunteersInvolved: {
      type: Number,
      default: 0
    },
    hoursContributed: {
      type: Number,
      default: 0
    },
    peopleImpacted: {
      type: Number,
      default: 0
    },
    fundsRaised: {
      type: Number,
      default: 0
    },
    customMetrics: [{
      name: String,
      value: Schema.Types.Mixed
    }]
  },
  updates: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    media: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Collaboration Schema
const CollaborationSchema = new Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  partners: [{
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Inactive'],
      default: 'Pending'
    }
  }],
  approvals: [{
    authority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    comments: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  meetings: [{
    title: String,
    date: Date,
    location: String,
    attendees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['Pending', 'Attending', 'Not Attending'],
        default: 'Pending'
      }
    }],
    notes: String
  }],
  documents: [{
    title: String,
    type: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
ProjectSchema.index({ 
  title: 'text', 
  'description.short': 'text', 
  'description.detailed': 'text' 
});
ProjectSchema.index({ 'location.coordinates': '2dsphere' });

// Add pre-save hooks for slug generation
ProjectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Collaboration = mongoose.models.Collaboration || mongoose.model('Collaboration', CollaborationSchema);

export { User, Project, Collaboration };
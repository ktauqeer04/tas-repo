const mongoose = require('mongoose');
const { MONGO_URL } = require('./server-config');


mongoose.connect( MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});



const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: String,
    location: String,
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    bannerUrl: String,
    isPublished: {
      type: Boolean,
      default: false
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    maxParticipants: {
      type: Number,
      default: 100
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
  }, {
    timestamps: true 
});
  
const Event = mongoose.model('Event', eventSchema);
const User = mongoose.model('User', userSchema);


module.exports = {
    Event, 
    User
}
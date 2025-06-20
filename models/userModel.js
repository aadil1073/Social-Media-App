import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },

  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    min: 6,
    max: 64
  },

  answer: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  about: {},

  image: {
    url: String,
    public_id: String
  },

  following: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],

  followers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],

  pendingRequests: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],

  notifications: [
    {
      type: {
        type: String,
        enum: ['follow-request'],
        default: 'follow-request'
      },
      from: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  messageNotifications: [
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    count: { type: Number, default: 1 }
  }
]

}, { timestamps: true });

export default mongoose.model('User', userSchema);

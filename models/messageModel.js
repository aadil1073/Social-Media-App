import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);

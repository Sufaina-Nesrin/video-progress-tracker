import mongoose from 'mongoose';

const segmentSchema = new mongoose.Schema({
  start: { type: Number, required: true }, // in seconds
  end: { type: Number, required: true },   // in seconds
}, { _id: false });

const videoProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  segments: { type: [segmentSchema], default: [] },
  totalWatchedSeconds: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, //percentage
  completed: {type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  userId: {type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

// Index for fast lookup
videoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export const VideoProgress = mongoose.model('VideoProgress', videoProgressSchema);
export const User = mongoose.model('User', userSchema);


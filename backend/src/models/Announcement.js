import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true, index: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);

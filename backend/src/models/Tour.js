import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    participantId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    oneSignalPlayerId: { type: String, trim: true },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    isConnected: { type: Boolean, default: true }
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourCode: { type: String, required: true, unique: true, match: /^\d{7}$/ },
    livekitRoomName: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'ended'], default: 'active', index: true },
    participants: [participantSchema],
    endedAt: Date
  },
  { timestamps: true }
);

export const Tour = mongoose.model('Tour', tourSchema);

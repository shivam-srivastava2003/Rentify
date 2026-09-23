import mongoose from 'mongoose';

export interface IDeletionHistory extends mongoose.Document {
  targetType: 'PROPERTY' | 'OWNER' | 'RENTER';
  targetId: string;
  targetTitle: string;
  targetEmail?: string;
  targetDetails?: string;
  reason: string;
  deletedBy: string;
  createdAt: Date;
}

const deletionHistorySchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['PROPERTY', 'OWNER', 'RENTER'],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetTitle: {
      type: String,
      required: true,
      default: 'Unnamed Item',
    },
    targetEmail: {
      type: String,
      default: '',
    },
    targetDetails: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      required: true,
    },
    deletedBy: {
      type: String,
      required: true,
      default: 'System Admin',
    },
  },
  {
    timestamps: true,
  }
);

const DeletionHistory = mongoose.model<IDeletionHistory>('DeletionHistory', deletionHistorySchema);

export default DeletionHistory;

import mongoose from 'mongoose';

export interface IAdmin {
  email: string;
  password: string;
  createdAt?: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

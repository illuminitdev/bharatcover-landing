import mongoose from 'mongoose';

export interface IContact {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employees: string;
  product: string;
  message?: string;
  isContacted?: boolean;
  createdAt?: Date;
}

const ContactSchema = new mongoose.Schema<IContact>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    employees: {
      type: String,
      required: [true, 'Number of employees is required'],
      trim: true,
    },
    product: {
      type: String,
      required: [true, 'Product selection is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    isContacted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: '',
    },
    userRole: {
      type: String,
      default: 'RENTER',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['PG', 'Single Room', 'Shared Room', '1BHK Flat', 'Studio'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['Boys PG', 'Girls PG', 'Unisex / Co-living', 'Any'],
      default: 'Any',
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    sector: {
      type: String,
      default: '',
    },
    street: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    area: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    maintenance: {
      type: Number,
      default: 0,
    },
    totalBeds: {
      type: Number,
      default: 10,
    },
    availableBeds: {
      type: Number,
      default: 6,
    },
    occupiedBeds: {
      type: Number,
      default: 4,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: ['WiFi', 'AC', 'Housekeeping', 'Power Backup'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;

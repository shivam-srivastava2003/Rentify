import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property';
import connectDB from './config/db';

dotenv.config();
connectDB();

const sampleProperties = [
  {
    title: 'Starlight Luxury PG for Men',
    description: 'Fully furnished luxury PG with 3 times food, high-speed WiFi, daily housekeeping, and power backup. Located 5 mins from Sony World Signal.',
    type: 'PG',
    gender: 'Boys PG',
    city: 'Bengaluru',
    area: 'Koramangala 4th Block',
    address: '12th Main Road, Koramangala 4th Block, Bengaluru',
    price: 9500,
    rating: 4.8,
    reviewCount: 42,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['High Speed WiFi', '3 Times Food', 'AC Room', 'Daily Housekeeping', 'Power Backup', 'Washing Machine'],
  },
  {
    title: 'GreenStays Co-living & Premium Rooms',
    description: 'Modern co-living space designed for tech professionals and students. Features gaming lounge, rooftop cafe, and biometric entry.',
    type: 'Single Room',
    gender: 'Unisex / Co-living',
    city: 'Bengaluru',
    area: 'HSR Layout Sector 1',
    address: '27th Main Rd, HSR Layout, Bengaluru',
    price: 14000,
    rating: 4.9,
    reviewCount: 88,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['WiFi', 'AC', 'Rooftop Cafe', 'Gym', 'Gaming Lounge', 'Security Guard'],
  },
  {
    title: 'Orchid Executive Girls PG',
    description: 'Safe and secure PG for working women with 24/7 CCTV surveillance, biometric access, home-cooked food, and attached balcony rooms.',
    type: 'PG',
    gender: 'Girls PG',
    city: 'Bengaluru',
    area: 'Indiranagar 100ft Road',
    address: '100ft Road, Near Metro Station, Indiranagar, Bengaluru',
    price: 11500,
    rating: 4.7,
    reviewCount: 35,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['WiFi', '24/7 Security', 'Biometric Lock', 'Home Food', 'Attached Bath'],
  },
  {
    title: 'UrbanNest Compact Studio Apartment',
    description: 'Fully independent studio unit with kitchen setup, balcony, refrigerator, and dedicated workspace.',
    type: 'Studio',
    gender: 'Any',
    city: 'Bengaluru',
    area: 'Whitefield ITPL',
    address: 'Near ITPL Main Gate, Whitefield, Bengaluru',
    price: 18500,
    rating: 4.6,
    reviewCount: 19,
    isAvailable: false, // Fully Occupied demo
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Private Kitchen', 'AC', 'WiFi', 'Fridge', 'Parking'],
  },
  {
    title: 'Seabreeze Premium PG for Professionals',
    description: 'Sea-facing shared rooms and single occupancy PG rooms in South Mumbai. Inclusive of breakfast and laundry services.',
    type: 'PG',
    gender: 'Unisex / Co-living',
    city: 'Mumbai',
    area: 'Andheri West',
    address: 'Lokhandwala Complex, Andheri West, Mumbai',
    price: 16500,
    rating: 4.8,
    reviewCount: 54,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['WiFi', 'AC', 'Breakfast Included', 'Laundry Service', 'Lift'],
  },
  {
    title: 'Powai Lakeview 1BHK Apartment',
    description: 'Furnished 1BHK flat ideal for working couples or small families with lake view and modular kitchen.',
    type: '1BHK Flat',
    gender: 'Any',
    city: 'Mumbai',
    area: 'Powai',
    address: 'Hiranandani Gardens, Powai, Mumbai',
    price: 28000,
    rating: 4.9,
    reviewCount: 29,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Modular Kitchen', 'Clubhouse Access', 'Parking', 'AC', '24/7 Security'],
  },
  {
    title: 'CyberCity Boys PG & Co-living',
    description: 'Proximity to Cyber Hub and DLF Phase 3. Spacious AC rooms with gaming area, gym, and 3-time meals.',
    type: 'PG',
    gender: 'Boys PG',
    city: 'Delhi NCR',
    area: 'Gurugram DLF Phase 3',
    address: 'DLF Phase 3, Near Rapid Metro, Gurugram, Delhi NCR',
    price: 12000,
    rating: 4.7,
    reviewCount: 61,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['WiFi', '3 Times Food', 'AC', 'Gym', 'Power Backup'],
  },
  {
    title: 'South Delhi Luxury Girls Hostel',
    description: 'Exclusive girls hostel near Delhi University South Campus. High security, CCTV, biometric entry, and nutritious meals.',
    type: 'PG',
    gender: 'Girls PG',
    city: 'Delhi NCR',
    area: 'Satya Niketan, New Delhi',
    address: 'Satya Niketan, Near Venkateswara College, New Delhi',
    price: 13500,
    rating: 4.8,
    reviewCount: 73,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Biometric Entry', 'Meals Included', 'AC', 'Study Room', '24/7 Warden'],
  },
  {
    title: 'HITEC City Tech Stays PG',
    description: 'Walking distance to HITEC City IT Parks. Clean rooms, high-speed fiber internet, and North/South Indian food options.',
    type: 'PG',
    gender: 'Unisex / Co-living',
    city: 'Hyderabad',
    area: 'Gachibowli',
    address: 'Near Deloitte Office, Gachibowli, Hyderabad',
    price: 8500,
    rating: 4.6,
    reviewCount: 47,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['WiFi', 'North/South Meals', 'AC', 'Housekeeping', 'Parking'],
  },
  {
    title: 'Koregaon Park Vintage Studio Room',
    description: 'Charming studio space in Koregaon Park with lush greenery, balcony cafe setup, and quiet study environment.',
    type: 'Single Room',
    gender: 'Any',
    city: 'Pune',
    area: 'Koregaon Park',
    address: 'Lane 7, Koregaon Park, Pune',
    price: 11000,
    rating: 4.9,
    reviewCount: 38,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['WiFi', 'Balcony', 'AC', 'Fridge', 'Quiet Garden'],
  },
];

const seedProperties = async () => {
  try {
    await Property.deleteMany({});
    console.log('Old properties cleared.');

    await Property.insertMany(sampleProperties);
    console.log('Sample properties seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
};

seedProperties();

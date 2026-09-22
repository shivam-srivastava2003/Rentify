import { Request, Response } from 'express';
import Property from '../models/Property';
import { uploadToCloudinary } from '../config/cloudinary';

const cleanAddressParts = (...parts: (string | undefined | null)[]): string => {
  const allSegments: string[] = [];
  for (const part of parts) {
    if (!part || typeof part !== 'string') continue;
    for (const sub of part.split(',')) {
      const trimmed = sub.trim();
      if (trimmed && trimmed.toLowerCase() !== 'n/a') {
        allSegments.push(trimmed);
      }
    }
  }
  const seen = new Set<string>();
  const uniqueSegments: string[] = [];
  for (const seg of allSegments) {
    const key = seg.toLowerCase().replace(/\s+/g, ' ');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSegments.push(seg);
    }
  }
  return uniqueSegments.join(', ');
};

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req: Request, res: Response) => {
  try {
    const { city, type, isAvailable, minPrice, maxPrice, search } = req.query;

    const queryFilter: any = {};

    if (city && city !== 'All') {
      queryFilter.city = { $regex: new RegExp(`^${city}`, 'i') };
    }

    if (type && type !== 'All') {
      queryFilter.type = type;
    }

    if (isAvailable !== undefined && isAvailable !== 'All') {
      queryFilter.isAvailable = isAvailable === 'true';
    }

    if (minPrice || maxPrice) {
      queryFilter.price = {};
      if (minPrice) queryFilter.price.$gte = Number(minPrice);
      if (maxPrice) queryFilter.price.$lte = Number(maxPrice);
    }

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { area: { $regex: search as string, $options: 'i' } },
        { city: { $regex: search as string, $options: 'i' } },
        { sector: { $regex: search as string, $options: 'i' } },
      ];
    }

    const properties = await Property.find(queryFilter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get properties listed by currently logged in owner
// @route   GET /api/properties/my-properties
// @access  Private (Owner/Admin)
export const getMyProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone whatsapp permanentAddress city businessName avatar propertyLocation unitCount'
    );

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Create new property listing (Owner/Admin)
// @route   POST /api/properties
// @access  Private (Owner/Admin)
export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      gender,
      city,
      sector,
      street,
      country,
      area,
      price,
      deposit,
      maintenance,
      totalBeds,
      availableBeds,
      occupiedBeds,
      images,
      amenities,
    } = req.body;

    if (!title || !type || !city || !price) {
      res.status(400).json({ success: false, message: 'Please provide required property details' });
      return;
    }

    // Process images and upload to Cloudinary if available
    let cloudinaryImageUrls: string[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      cloudinaryImageUrls = await Promise.all(
        images.map((imgStr: string) => uploadToCloudinary(imgStr))
      );
    }

    const constructedArea = cleanAddressParts(sector, area, city);
    const constructedAddress = cleanAddressParts(street, sector, area, city, country || 'India');

    const property = await Property.create({
      title,
      description: description || `${type} listing in ${city}`,
      type,
      gender: gender || 'Any',
      city,
      sector: sector || '',
      street: street || '',
      country: country || 'India',
      area: constructedArea,
      address: constructedAddress,
      price: Number(price),
      deposit: Number(deposit || 0),
      maintenance: Number(maintenance || 0),
      totalBeds: Number(totalBeds || 10),
      availableBeds: Number(availableBeds || 6),
      occupiedBeds: Number(occupiedBeds || 4),
      images: cloudinaryImageUrls,
      amenities: amenities || ['WiFi', 'AC', 'Housekeeping', 'Power Backup'],
      owner: req.user._id,
      isAvailable: Number(availableBeds || 6) > 0,
    });

    res.status(201).json({
      success: true,
      message: 'Property posted successfully!',
      data: property,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update property listing (Owner/Admin)
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Check ownership authorization
    if (property.owner && property.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Not authorized to update this property' });
      return;
    }

    const {
      title,
      description,
      type,
      gender,
      city,
      sector,
      street,
      country,
      area,
      price,
      deposit,
      maintenance,
      totalBeds,
      availableBeds,
      occupiedBeds,
      images,
      amenities,
    } = req.body;

    // Process images with Cloudinary if new image strings provided
    let updatedImages = property.images;
    if (images && Array.isArray(images) && images.length > 0) {
      updatedImages = await Promise.all(
        images.map((imgStr: string) => {
          // If image is already a hosted Cloudinary/HTTP URL, keep as is; otherwise upload
          if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
            return Promise.resolve(imgStr);
          }
          return uploadToCloudinary(imgStr);
        })
      );
    }

    const constructedArea = cleanAddressParts(sector, area || property.area, city || property.city);
    const constructedAddress = cleanAddressParts(
      street !== undefined ? street : property.street,
      sector !== undefined ? sector : property.sector,
      area || property.area,
      city || property.city,
      country || property.country || 'India'
    );

    property.title = title || property.title;
    property.description = description !== undefined ? description : property.description;
    property.type = type || property.type;
    property.gender = gender || property.gender;
    property.city = city || property.city;
    property.sector = sector !== undefined ? sector : property.sector;
    property.street = street !== undefined ? street : property.street;
    property.country = country || property.country;
    property.area = constructedArea;
    property.address = constructedAddress;
    property.price = price !== undefined ? Number(price) : property.price;
    property.deposit = deposit !== undefined ? Number(deposit) : property.deposit;
    property.maintenance = maintenance !== undefined ? Number(maintenance) : property.maintenance;
    property.totalBeds = totalBeds !== undefined ? Number(totalBeds) : property.totalBeds;
    property.availableBeds = availableBeds !== undefined ? Number(availableBeds) : property.availableBeds;
    property.occupiedBeds = occupiedBeds !== undefined ? Number(occupiedBeds) : property.occupiedBeds;
    property.images = updatedImages;
    property.amenities = amenities || property.amenities;
    property.isAvailable = (property.availableBeds || 0) > 0;

    const updatedProperty = await property.save();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully!',
      data: updatedProperty,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Delete property listing (Owner/Admin)
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Check ownership authorization
    if (property.owner && property.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
      return;
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

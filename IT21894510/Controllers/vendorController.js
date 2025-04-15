import Vendor from '../Models/vendorModel.js';
import bcrypt from 'bcrypt';

// CREATE a new Vendor (Only Admin)
export const createVendor = async (req, res) => {
  try {
    const { email, vendorName, company, contact, address, password } = req.body;
    if (!email || !vendorName || !company || !contact || !address || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if vendor already exists
    const duplicate = await Vendor.findOne({ email }).exec();
    if (duplicate) {
      return res.status(409).json({ message: 'A vendor with this email already exists.' });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({
      email,
      vendorName,
      company,
      contact,
      address,
      password: hashedPwd,
      // roles default to { Vendor: 1984 } from the schema;
      // we can also manually set it here if needed.
    });

    return res.status(201).json({ message: 'Vendor created successfully', vendor: newVendor });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET all Vendors (Only Admin)
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ message: 'No vendors found.' });
    }
    return res.status(200).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET a single Vendor by ID (Only Admin)
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    return res.status(200).json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE a Vendor (Only Admin)
// E.g. to let admin update vendor info
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, vendorName, company, contact, address, password } = req.body;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    // Update fields only if they’re provided
    if (email) vendor.email = email;
    if (vendorName) vendor.vendorName = vendorName;
    if (company) vendor.company = company;
    if (contact) vendor.contact = contact;
    if (address) vendor.address = address;
    // If a new password is provided, hash it
    if (password) {
      vendor.password = await bcrypt.hash(password, 10);
    }

    const updatedVendor = await vendor.save();
    return res.status(200).json({
      message: 'Vendor updated successfully',
      vendor: updatedVendor
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE a Vendor (Only Admin)
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    const result = await vendor.deleteOne();
    return res.status(200).json({
      message: 'Vendor deleted successfully',
      vendor: result
    });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

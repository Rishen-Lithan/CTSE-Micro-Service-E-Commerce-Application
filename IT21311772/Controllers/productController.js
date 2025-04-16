import Product from "../Models/productModel.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';
import Vendor from '../Models/vendorModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../Uploads/images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"));
        }
    }    
}).single('image');


// Controller Function to Add Product
export const addProduct = async (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, description, category, price, remainingQuantity } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please enter the product name' });
        } else if (!description) {
            return res.status(400).json({ message: 'Please enter the description' });
        } else if (description.length > 250) {
            return res.status(400).json({ message: 'Description length should be less than 250 characters' });
        } else if (!category) {
            return res.status(400).json({ message: 'Please select a category' });
        } else if (!price) {
            return res.status(400).json({ message: 'Please enter the price' });
        } else if (!remainingQuantity) {
            return res.status(400).json({ message: 'Please enter the quantity' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please select an Image' });
        }

        const vendorEmail = req.user;
        if (!vendorEmail) {
            return res.status(403).json({ message: 'Unauthorized: No vendor information found' });
        }

        try {
            const vendor = await Vendor.findOne({ email: vendorEmail });
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }

            const relativeImagePath = path.relative(process.cwd(), req.file.path);

            const newProduct = new Product({
                name,
                image: relativeImagePath,
                description,
                category,
                price: Number(price),
                remainingQuantity: Number(remainingQuantity),
                vendor: vendor._id,
            });

            const product = await newProduct.save();

            const populatedProduct = await Product.findById(product._id).populate('vendor', 'email vendorName contact address company');

            return res.status(201).json({ message: 'Product added successfully', product: populatedProduct });
        } catch (error) {
            console.error("Error adding product:", error);
            return res.status(500).json({ message: 'Error adding product' });
        }
    });
};

// Controller Function to List Products
export const getProducts = async (req, res) => {
    const products = await Product.find().populate('vendor', 'email vendorName contact address company');
    if (!products) {
        return res.status(404).json({ 'message': 'No Products Available' });
    }
    return res.json(products);
}

// Controller Function to Retrieve Product
export const getProductById = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(404).json({ 'message': 'Product ID is required' });
    }

    try {
        const product = await Product.findById({ _id: req.params.id }).populate('vendor', 'email vendorName contact address company');
        if (!product) {
            return res.status(404).json({ 'message': 'No product found with that ID ' });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product details : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

// Controller Function to Delete Product
export const deleteProduct = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(404).json({ 'message': 'Product ID is required' });
    }

    try {
        const product = await Product.findById({ _id: req.body.id });
        if (!product) {
            return res.status(404).json({ 'message': 'No product found with that ID' });
        }

        const isProductDeleted = await product.deleteOne({ _id: req.body.id });
        res.status(200).json(isProductDeleted);
    } catch (error) {
        console.error('Error deleting product : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

// Controller Function to Update Product
export const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const { name, description, category, price, remainingQuantity } = req.body;

        if (description && description.length > 250) {
            return res.status(400).json({ message: 'Description length should be less than 250 characters' });
        }

        const updatedData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(category && { category }),
            ...(price && { price: Number(price) }),
            ...(remainingQuantity && { remainingQuantity: Number(remainingQuantity) }),
        };

        if (req.file) {
            updatedData.image = path.relative(process.cwd(), req.file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: error.message || 'Error updating product' });
    }
};

// Controller Function to Manage Inventory
export const manageQuantity = async (req, res) => {
    const { quantity } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.remainingQuantity < quantity) return res.status(400).json({ message: 'Not enough quantity' });

        product.remainingQuantity -= quantity;
        await product.save();

        res.status(200).json({ message: 'Quantity updated', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


// Controller Function to List Products for API Call
export const getProductsAPI = async (req, res) => {
    const products = await Product.find().populate('vendor', 'email vendorName contact address company');
    if (!products) {
        return res.status(404).json({ 'message': 'No Products Available' });
    }
    return res.json(products);
}

// Controller Function to Retrieve Product for API Call
export const getProductByIdAPI = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(404).json({ 'message': 'Product ID is required' });
    }

    try {
        const product = await Product.findById({ _id: req.params.id }).populate('vendor', 'email vendorName contact address company');
        if (!product) {
            return res.status(404).json({ 'message': 'No product found with that ID ' });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product details : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}
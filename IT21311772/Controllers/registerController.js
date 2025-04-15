import User from "../Models/userModel.js";
import Vendor from "../Models/vendorModel.js";
import bcrypt from 'bcrypt';
import validator from "validator";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const handleNewUser = async (req, res) => {
    const { email, pwd } = req.body;

    if(!email || !pwd) return res.status(400).json({ 'message': 'Email and Password are required' });

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 'message': 'Please enter a valid email address '});
    }

    const passwordLength = 8;
    if (pwd.length < passwordLength) {
        return res.status(400).json({ 'message': `Password should have at least ${passwordLength} characters`});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(pwd)) {
        return res.status(400).json({ 'message': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    }

    const duplicate = await User.findOne({ email: email });
    if(duplicate) return res.status(409).json({ 'message': 'Email is already in use'});

    try {
        const hashPwd = await bcrypt.hash(pwd, 10);

        const result = await User.create({
            "email": email,
            "password": hashPwd
        });

        res.status(201).json({ 'success': 'User Registered Successfully' });
    } catch(error) {
        res.status(500).json({ 'message': error.message });
    }
}

export const handleNewVendor = async (req, res) => {
    const { email, pwd, vendorName, address, contact, company } = req.body;

    if (!email || !vendorName || !address || !contact || !company || !pwd) {
        return res.status(400).json({ 'message': 'Please Fill All the Required Fields ' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 'message': 'Please enter a valid email address '});
    }

    const contactLength = 10;
    if (contact.length !== contactLength) {
        return res.status(400).json({ 'message': 'Contact Number should have only 10 digits' });
    }
    const addressLength = 10;
    if (contact.length !== addressLength) {
        return res.status(400).json({ 'message': 'Contact Number should have only 10 digits' });
    }

    const passwordLength = 8;
    if (pwd.length < passwordLength) {
        return res.status(400).json({ 'message': `Password should have at least ${passwordLength} characters`});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(pwd)) {
        return res.status(400).json({ 'message': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(pwd, 10);

        const newVendor = new Vendor({
            email,
            vendorName,
            address,
            contact,
            company,
            password: hashedPassword
        });
        const savedVendor = await newVendor.save();

        const newUser = new User({
            email,
            password: hashedPassword,
            roles: { Vendor: 1984 }
        });
        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to List Master',
            text: `Hello ${vendorName},\n\nYour vendor account has been created successfully!\n\nEmail: ${email}\nPassword: ${pwd}\n\nPlease change your password after your first login for security reasons.\n\nBest Regards,\nList Master`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Vendor created, but error sending email' });
            }
            console.log('Email sent : ', info.response);
            res.status(201).json({ message: 'Vendor created successfully', vendor: savedVendor });
        });

    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
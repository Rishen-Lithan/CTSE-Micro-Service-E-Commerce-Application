import User from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from "validator";

const rateLimit = new Map();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000;

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        return res.status(400).json({ 'message' : 'Email & Password are Required '});
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 'message': 'Please Enter a Valid Email Address '});
    }

    try {
        const ip = req.ip;
        const now = Date.now();

        // Check if the account is locked due to multiple failed attempts
        if (rateLimit.has(email)) {
            const { attempts, lockUntil } = rateLimit.get(email);
            if (lockUntil && now < lockUntil) {
                return res.status(429).json({ 'message': 'Too many failed attempts. Try again later.' });
            }
        }

        const foundUser = await User.findOne({ email: email });
        
        if (!foundUser) {
            incrementFailedAttempts(email);
            return res.status(401).json({ 'message': 'Invalid Credentials' });
        }

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            resetFailedAttempts(email);

            const roles = Object.values(foundUser.roles);
            if (!roles) {
                return res.status(403).json({ 'message': 'User roles are invalid' });
            }

            // create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3600s' }
            );
            const refreshToken = jwt.sign(
                { "email": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d'}
            );

            // Saving refreshToken with current user
            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            res.cookie('jwt', refreshToken, { 
                httpOnly: true, 
                secure: true, 
                sameSite: 'None', 
                maxAge: 24 * 60 * 60 * 1000 }
            );
            
            console.log(`User ${foundUser.email} logged in from IP: ${ip}`);

            res.json({ accessToken, roles });
        } else {
            incrementFailedAttempts(email);
            return res.status(401).json({ 'message': 'Invalid Credentials' });
        }

    } catch (error) {
        console.error('Internal Server Error : ', error);
        return res.status(500).json({ 'message': 'Internal Server Error' });
    }
}

const incrementFailedAttempts = (email) => {
    const now = Date.now();

    if (!rateLimit.has(email)) {
        rateLimit.set(email, { attempts: 1, lockUntil: null });
    } else {
        const data = rateLimit.get(email);
        if (data.attempts >= MAX_ATTEMPTS) {
            data.lockUntil = now + LOCK_TIME;
        } else {
            data.attempts += 1;
        }
        rateLimit.set(email, data);
    }
};

const resetFailedAttempts = (email) => {
    rateLimit.delete(email);
};

export default handleLogin;
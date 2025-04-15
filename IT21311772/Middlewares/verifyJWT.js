import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // If there's no token or the token doesn't start with 'Bearer'
    if (!authHeader?.startsWith('Bearer')) {
        return res.status(200).json({ message: 'Welcome! Please log in to access this resource.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(200).json({ message: 'Welcome! Please log in to access this resource.' });
        }

        req.user = decoded.UserInfo.email;
        req.roles = decoded.UserInfo.roles;
        next(); // Allow the request to continue to the next middleware or route handler
    });
};

export default verifyJWT;

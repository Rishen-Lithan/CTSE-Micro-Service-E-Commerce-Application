import dotenv from 'dotenv'
dotenv.config();

// Import Packages & Middlewares
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import verifyJWT from './Middlewares/verifyJWT.js';

const PORT = process.env.PORT || 3500;
import connectDB from './Config/dbConn.js';

// Auth Routes
import RegisterRoute from './Routes/registerRoute.js';
import LoginRoute from './Routes/loginRoute.js';
import LogoutRoute from './Routes/logoutRoute.js';

// Other Routes
import inventoryRoutes from './Routes/inventoryRoute.js';
import cartRoutes from './Routes/cartRoute.js';


const app = express();

connectDB();

// Use In-Built Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth-Routes
app.use('/register', RegisterRoute);
app.use('/login', LoginRoute);
app.use('/logout', LogoutRoute);


// Other-Routes

app.use('/inventory',verifyJWT, inventoryRoutes);
app.use('/cart', verifyJWT, cartRoutes);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})

app.get('/', (req, res) => {
    res.send('Welcome to the Product Service!');
});

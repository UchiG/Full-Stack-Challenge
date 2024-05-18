import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
});
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});

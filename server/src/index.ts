import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import route from './routes/userRoute';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT: string | number = process.env.PORT || 8000;
const MONGOURL: string = process.env.MONGO_URL as string;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log('DB connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port :${PORT}`);
    });
  })
  .catch((error) => console.log(error));

app.use('/api', route);

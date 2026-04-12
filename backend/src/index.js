import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routes/auth.routes.js';
import researchRouter from './routes/research.routes.js';
import { verifyjwt } from './middleware/verifyJWT.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());

app.use('/api/auth/', authRouter);
app.use('/api/research/', researchRouter);

mongoose.connect("mongodb://127.0.0.1:27017/blog").then(() => {
    app.listen(PORT, () => {
        console.log("MongoDB connect!!");
        console.log(`Server is running http://localhost:${PORT}`);
    })
})
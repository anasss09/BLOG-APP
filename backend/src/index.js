import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routes/auth.routes.js';
import researchRouter from './routes/research.routes.js';
import eventRouter from './routes/event.routes.js';
import newsRouter from './routes/news.routes.js';
import userRouter from './routes/user.routes.js';
import { verifyjwt } from './middleware/verifyJWT.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'https://blog-app-mauve-mu.vercel.app/',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());

app.use('/api/auth/', authRouter);
app.use('/api/research/', researchRouter);
app.use('/api/events/', eventRouter);
app.use('/api/news/', newsRouter);
app.use('/api/users/', userRouter);

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log("MongoDB connect!!");
        console.log(`Server is running http://localhost:${PORT}`);
    })
})

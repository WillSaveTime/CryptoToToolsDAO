import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from 'body-parser'
import UserRoute from './routes/UserRoute.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1::27017/cryptoDAO',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));
 
app.use(cors());
app.use(express.json());
app.use(UserRoute);
 
app.listen(5000, ()=> console.log('Server up and running...'));
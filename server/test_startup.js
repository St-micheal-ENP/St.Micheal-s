import dotenv from 'dotenv';
dotenv.config();
console.log('Dotenv loaded, PORT:', process.env.PORT);
import express from 'express';
const app = express();
console.log('Express loaded');

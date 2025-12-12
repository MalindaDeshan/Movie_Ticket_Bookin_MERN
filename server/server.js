import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './configs/db.js';

const app = express();
const port = 3000;

await connectDB();

//Middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
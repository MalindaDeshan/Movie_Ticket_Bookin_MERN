import express from 'express';
import { addShow, getNowPlayingMovies } from '../controllers/showController.js';
import { projectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

showRouter.get('/now-playing',projectAdmin, getNowPlayingMovies)
showRouter.post('/add',projectAdmin, addShow)

export default showRouter;
import express from 'express';
import { projectAdmin } from '../middleware/auth.js';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/is-admin', projectAdmin, isAdmin)
adminRouter.get('/dashboard', projectAdmin, getDashboardData)
adminRouter.get('/all-shows', projectAdmin, getAllShows)
adminRouter.get('/all-bookings', projectAdmin, getAllBookings)

export default adminRouter;
import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Releases from './pages/Releases';

// Admin Pages
import AdminLayout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import ListBooking from './pages/admin/ListBooking';

// Clerk
import { SignedOut, SignIn } from '@clerk/clerk-react';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster />

      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/new-releases" element={<Releases />} />

        {/* Sign-In Page */}
        <Route
          path="/sign-in"
          element={
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
              <SignedOut>
                <SignIn
                  routing="path"
                  path="/sign-in"
                  afterSignInUrl="/admin"
                  afterSignUpUrl="/admin"
                />
              </SignedOut>
            </div>
          }
        />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBooking />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
import React, {useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';

const ListBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings,setBookings] = useState([]);
  const [loading,setLoading] = useState(true);

  const fetchAllBookings = async () => {
    setBookings(dummyBookingData)
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBookings();
  },[]);

  return !loading ?(
    <div>
      <Title text1="List" text2="Bookings"/>
    </div>
  ):<Loading/>;
}

export default ListBooking

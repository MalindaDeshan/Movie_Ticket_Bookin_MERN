import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTokenSafe = async () => {
    if (!authLoaded) return null;
    let token = await getToken();
    if (!token) {
      await new Promise((r) => setTimeout(r, 100));
      token = await getToken();
    }
    return token;
  };

  /* ---------------- PUBLIC DATA ---------------- */
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get("/api/show/all");
        if (data.success) setShows(data.shows || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchShows();
  }, []);

  /* ---------------- LOAD USER DATA ---------------- */
  useEffect(() => {
    if (!userLoaded || !authLoaded || !user) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }

    const loadUserData = async () => {
      setIsAdminLoading(true);
      try {
        const token = await getTokenSafe();
        if (!token) {
          setIsAdminLoading(false);
          return;
        }

        const adminRes = await axios.get("/api/admin/is-admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(!!adminRes.data.isAdmin);

        const favRes = await axios.get("/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (favRes.data.success) setFavoriteMovies(favRes.data.movies || []);
      } catch (err) {
        console.error("Error loading user data:", err);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };

    loadUserData();
  }, [userLoaded, authLoaded, user]);

  /* ---------------- MANUAL REFETCH ---------------- */
  const refetchFavorites = async () => {
    if (!user) return;
    try {
      const token = await getTokenSafe();
      if (!token) return;
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setFavoriteMovies(data.movies || []);
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    axios,
    user,
    getToken,
    isAdmin,
    isAdminLoading,
    shows,
    favoriteMovies,
    refetchFavorites,
    image_base_url
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
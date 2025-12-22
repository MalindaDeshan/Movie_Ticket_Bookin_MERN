import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Safe getToken helper
  const getTokenSafe = async () => {
    if (!authLoaded) return null;
    let token = await getToken({ template: "session" }); // important
    if (!token) {
      await new Promise(r => setTimeout(r, 50));
      token = await getToken({ template: "session" });
    }
    return token;
  };

  /* ---------------- PUBLIC DATA ---------------- */
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get("/api/show/all");
        if (data.success) setShows(data.shows);
        else toast.error(data.message);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load shows");
      }
    };
    fetchShows();
  }, []);

  /* ---------------- AUTHENTICATED DATA ---------------- */
  useEffect(() => {
    if (!userLoaded || !authLoaded || !user) return;

    const loadUserData = async () => {
      try {
        const token = await getTokenSafe();
        if (!token) return;

        // ---- Admin Check ----
        const adminRes = await axios.get("/api/admin/is-admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(adminRes.data.isAdmin);

        if (!adminRes.data.isAdmin && location.pathname.startsWith("/admin")) {
          navigate("/");
          toast.error("You are not Authorized. Admin only");
        }

        // ---- Favorites ----
        const favRes = await axios.get("/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (favRes.data.success) setFavoriteMovies(favRes.data.movies);
      } catch (err) {
        console.error(err);
      }
    };

    loadUserData();
  }, [userLoaded, authLoaded, user, getToken, location.pathname, navigate]);

  /* ---------------- MANUAL REFETCH ---------------- */
  const refetchFavorites = async () => {
    try {
      const token = await getTokenSafe();
      if (!token) return;

      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setFavoriteMovies(data.movies);
    } catch (err) {
      console.error(err);
    }
  };

  const value = { axios, user, isAdmin, shows, favoriteMovies, refetchFavorites };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/* ---------------- CUSTOM HOOK ---------------- */
export const useAppContext = () => useContext(AppContext);

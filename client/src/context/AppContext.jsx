import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true); // NEW: tracks if admin check is done
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

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

  /* ---------------- PUBLIC DATA: Shows ---------------- */
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get("/api/show/all");
        if (data.success) {
          setShows(data.shows || []);
        } else {
          toast.error(data.message || "Failed to load shows");
        }
      } catch (err) {
        console.error("Error fetching shows:", err);
        toast.error("Failed to load shows");
      }
    };
    fetchShows();
  }, []);

  /* ---------------- LOAD USER DATA ---------------- */
  useEffect(() => {
    if (!userLoaded || !authLoaded || !user) {
      setIsAdminLoading(true); // reset when no user
      return;
    }

    const loadUserData = async () => {
      setIsAdminLoading(true); // start loading

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
        if (favRes.data.success) {
          setFavoriteMovies(favRes.data.movies || []);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false); // always finish loading
      }
    };

    loadUserData();
  }, [userLoaded, authLoaded, user]);

  /* ---------------- ADMIN ROUTE PROTECTION (NO MORE RACE) ---------------- */
  useEffect(() => {
    if (!userLoaded || !authLoaded) return;

    // If no user → let Clerk handle sign-in
    if (!user && location.pathname.startsWith("/admin")) {
      return;
    }

    // Only act AFTER admin check is complete
    if (!isAdminLoading && user && !isAdmin && location.pathname.startsWith("/admin")) {
      navigate("/", { replace: true });
      toast.error("You are not authorized. Admin only.");
    }
  }, [userLoaded, authLoaded, user, isAdmin, isAdminLoading, location.pathname, navigate]);

  /* ---------------- MANUAL REFETCH ---------------- */
  const refetchFavorites = async () => {
    if (!user) return;
    try {
      const token = await getTokenSafe();
      if (!token) return;

      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setFavoriteMovies(data.movies || []);
      }
    } catch (err) {
      console.error("Error refetching favorites:", err);
    }
  };

  const value = {
    axios,
    user,
    isAdmin,
    isAdminLoading, // optional: expose if needed in UI
    shows,
    favoriteMovies,
    refetchFavorites,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
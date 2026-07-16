import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error(error);
            }

            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        try {
            const res = await api.post("/auth/login", formData);

            await fetchCurrentUser();

            toast.success(res.data.message);

            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const res = await api.post("/auth/register", formData);

            await fetchCurrentUser();

            toast.success(res.data.message);

            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const logout = async () => {
        try {
            const res = await api.post("/auth/logout");

            setUser(null);

            toast.success(res.data.message);

            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
            throw error;
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                fetchCurrentUser,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
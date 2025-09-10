import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  onIdTokenChanged,
  signOut,
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// ✅ Firebase config (keep sensitive stuff in .env if possible)
const firebaseConfig = {
  apiKey: "AIzaSyBY2KRBaqOEZD85ml-Mcnnj3HEumGJ4nmA",
  authDomain: "readme-gen-8535c.firebaseapp.com",
  projectId: "readme-gen-8535c",
  storageBucket: "readme-gen-8535c.firebasestorage.app",
  messagingSenderId: "849146623353",
  appId: "1:849146623353:web:200ab08978306cc63deba8",
  measurementId: "G-G4G4NFTRNS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  // ✅ Login with GitHub via Firebase
  const loginWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const githubAccessToken = credential?.accessToken;
      const idToken = await result.user.getIdToken();

      setUser(result.user);
      setToken(idToken);

      // ✅ Send token + GitHub access token to backend
      await axios.post(`${API_BASE_URL}/auth/login`, {
        githubAccessToken,
        firebaseToken: idToken,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("GitHub login failed:", error);
    }
  };

  // ✅ Listen for token refresh (instead of just auth state)
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const idToken = await firebaseUser.getIdToken(true); // force refresh
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  // ✅ Axios interceptor to attach token to all requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        loginWithGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

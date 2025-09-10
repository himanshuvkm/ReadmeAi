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
import toast from "react-hot-toast";


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();
provider.addScope("repo");
provider.addScope("read:org");

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://readmegen-vert.vercel.app";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [githubToken, setGithubToken] = useState(
    localStorage.getItem("githubToken") || null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const githubAccessToken = credential?.accessToken;
      const idToken = await result.user.getIdToken();

      setUser(result.user);
      setToken(idToken);

      if (githubAccessToken) {
        setGithubToken(githubAccessToken);
        localStorage.setItem("githubToken", githubAccessToken);
      }

      await axios.post(`${API_BASE_URL}/auth/login`, {
        githubAccessToken,
        firebaseToken: idToken,
      });

      navigate("/dashboard");
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("GitHub login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const idToken = await firebaseUser.getIdToken(true);
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
        setGithubToken(null);
        localStorage.removeItem("githubToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    setGithubToken(null);
    localStorage.removeItem("githubToken");
    navigate("/login");
    toast("You have been logged out.");
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        githubToken,
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


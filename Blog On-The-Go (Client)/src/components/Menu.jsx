import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { AuthContext } from "../context/AuthProvider";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import axios from "axios";
import app from "../../firebase.config";

const auth = getAuth(app);

const Menu = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const controls = useAnimation();

  const animateMenu = async () => {
    await controls.start({ opacity: 1, y: 0 });
  };

  const handleLogout = async () => {
    try {
      await axios
        .get("https://blog-otg-backend.vercel.app/api/logout", {
          withCredentials: true,
        })
        .then((resp) => {
          console.log(resp);
          navigate("/login");
          return signOut(auth);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    animateMenu();
  }, []);

  const isSmallScreen = window.innerWidth <= 768; // Adjust the breakpoint as needed

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={controls}
      className="bg-black w-[200px] z-10 flex flex-col absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4 text-center justify-center items-center"
    >
      {!user && (
        <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
          <Link to="/login">Login</Link>
        </h3>
      )}
      {!user && (
        <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
          <Link to="/register">Register</Link>
        </h3>
      )}
      {user && (
        <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
          <img
            src={user.photoURL}
            className="h-10 w-10 rounded-lg mx-auto"
            alt=""
          />
          <h1>{user.displayName}</h1>
        </h3>
      )}

      {user && (
        <h3
          onClick={handleLogout}
          className="text-white text-sm hover:text-gray-500 cursor-pointer btn btn-sm btn-error"
        >
          Logout
        </h3>
      )}

      {/* Additional routes for small screens */}
      {isSmallScreen && (
        <div className="py-2">
          <h3 className="text-white py-2 text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/write">Create Blog</Link>
          </h3>
          <h3 className="text-white py-2 text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/allblogs">All Blogs</Link>
          </h3>
          <h3 className="text-white py-2 text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/featured">Featured Blogs</Link>
          </h3>
          <h3 className="text-white py-2 text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/wishlist">Wishlist</Link>
          </h3>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { useContext } from "react";
import { motion, useAnimation } from "framer-motion"; // Import Framer Motion
import Menu from "./Menu";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const controls = useAnimation(); // Framer Motion controls

  const showMenu = () => {
    setMenu(!menu);
  };

  const animateNavbar = async () => {
    await controls.start({ opacity: 1, x: 0 }); // Customize the animation as per your requirements
  };

  useEffect(() => {
    animateNavbar();
  }, []);

  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={controls}
      className="flex items-center justify-between px-6 py-4"
    >
      <h1 className="text-lg md:text-xl font-extrabold flex justify-center items-center">
        <img src="/icons8-blogger-48.png" className="px-4" alt="" />
        <Link to="/">Blog On-The-Go!</Link>
      </h1>
      {path === "/" && (
        <div className="flex justify-center items-center space-x-2 md:space-x-4">
          <p
            onClick={() =>
              navigate(prompt ? "?search=" + prompt : navigate("/"))
            }
            className="cursor-pointer"
          >
            <BsSearch />
          </p>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="outline-none px-3"
            placeholder="Search a post"
            type="text"
          />
        </div>
      )}
      <div className="hidden md:flex items-center justify-center space-x-2 md:space-x-4">
        <h3>
          <Link to="/">Home</Link>
        </h3>
        {/* {user ? ( */}
        <>
          <h3>
            <Link to="/write">Create Blog</Link>
          </h3>
          <h3>
            <Link to="/allblogs">All Blogs</Link>
          </h3>
          <h3>
            <Link to="/featured">Featured Blogs</Link>
          </h3>
          <h3>
            <Link to="/wishlist">Wishlist</Link>
          </h3>
        </>
        {!user ? (
          <h3 className="btn btn-outline btn-accent font-bold ml-8">
            <Link to="/login">Login</Link>
          </h3>
        ) : (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative">
              <FaBars />
            </p>
            {menu && <Menu />}
          </div>
        )}
        {/* )} */}
        {/* {user ? (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative">
              <FaBars />
            </p>
            {menu && <Menu />}
          </div>
        ) : (
          <h3>
            <Link to="/register">Register</Link>
          </h3>
        )} */}
      </div>
      <div onClick={showMenu} className="md:hidden text-lg">
        <p className="cursor-pointer relative">
          <FaBars />
        </p>
        {menu && <Menu />}
      </div>
    </motion.div>
  );
};

export default Navbar;

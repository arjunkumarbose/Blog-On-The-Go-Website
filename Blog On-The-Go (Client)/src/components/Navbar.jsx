import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import Menu from "./Menu";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const controls = useAnimation();
  const { user } = useContext(AuthContext);

  // Theme Toggle
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const showMenu = () => {
    setMenu(!menu);
  };

  const animateNavbar = async () => {
    await controls.start({ opacity: 1, x: 0 });
  };

  useEffect(() => {
    animateNavbar();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={controls}
      className={`flex items-center justify-between px-6 py-4 bg-${theme}`}
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

          {/* Dark Mode Toggle Button */}
          <div className="flex justify-center items-center pl-4">
            <label className="swap swap-rotate">
              <input
                onChange={toggleTheme}
                type="checkbox"
                checked={theme === "dark"}
                className="pl-10"
              />
              {/* sun icon */}
              <svg
                className="swap-on fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
              <svg
                className="swap-off fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
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

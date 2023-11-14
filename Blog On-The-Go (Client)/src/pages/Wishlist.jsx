import React, { useContext, useEffect, useState } from "react";
import HomePosts from "../components/HomePosts";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { GiPeaceDove } from "react-icons/gi";
import { LuCalendarDays } from "react-icons/lu";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { search } = useLocation();

  const [wishlist, setWishlist] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSortButtonClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app" + "/api/posts" + search
      );

      // Convert and parse date strings to Date objects
      const parsedPosts = res.data.map((post) => ({
        ...post,
        updatedAt: new Date(post.updatedAt),
      }));

      // Sort the posts based on the getTime() method of Date objects
      const sortedPosts = parsedPosts.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      setPosts(sortedPosts);

      if (sortedPosts.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }

      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app" + "/api/posts/categories"
      );
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [search, sortOrder]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);

    fetchCategories();
  }, []);

  const filteredWishlist = wishlist
    .filter(
      (post) =>
        (!selectedCategory || post.categories.includes(selectedCategory)) &&
        (!searchText ||
          post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.desc.toLowerCase().includes(searchText.toLowerCase()))
    )
    .map((post) => (
      <Link to={`/posts/post/${post._id}`} key={post._id}>
        <HomePosts post={post} />
      </Link>
    ));

  const sortedWishlist = filteredWishlist.sort((a, b) => {
    const dateA = new Date(a.props.children.props.post.updatedAt).getTime();
    const dateB = new Date(b.props.children.props.post.updatedAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <>
      {loading ? (
        <span className="loading"></span>
      ) : user ? (
        <div>
          <Navbar />
          <div>
            <h1 className="flex justify-center text-2xl font-bold my-4 ">
              Your Wishlist
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 px-10 py-10">
              <div className="flex justify-center items-center mt-8 space-x-4">
                <input
                  type="text"
                  placeholder="Search...."
                  value={searchText}
                  onChange={handleSearchTextChange}
                  className="px-4 py-2 outline-rounded-lg"
                />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="px-4 py-2 outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Photography">Photography</option>
                  <option value="Travel">Travel</option>
                  <option value="Games">Games</option>
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
                <button
                  onClick={handleSortButtonClick}
                  className="px-4 py-2 flex justify-center items-center outline-rounded-lg"
                >
                  Sort By: {"  "}
                  <div className="pl-2">{<LuCalendarDays />}</div>
                  <div className="px-2">{<RiArrowLeftRightFill />}</div>
                  {sortOrder === "asc" ? (
                    <div>
                      <FaArrowUpWideShort />
                    </div>
                  ) : (
                    <div>
                      <FaArrowDownWideShort />
                    </div>
                  )}
                </button>
              </div>

              {sortedWishlist.length > 0 ? (
                sortedWishlist
              ) : (
                <h3 className="flex justify-center items-center text-lg text-red-400 text-center font-bold mt-16">
                  You have no posts in your wishlist!
                  <div className="pl-2">
                    <GiPeaceDove />
                  </div>
                </h3>
              )}
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <Navigate to="/login"></Navigate>
      )}
    </>
  );
};

export default Wishlist;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LuCalendarDays } from "react-icons/lu";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { RiArrowLeftRightFill } from "react-icons/ri";

const AllBlogs = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  const handleSortButtonClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app" + "/api/posts" + search
      );

      console.log("Raw data:", res.data);

      // Convert and parse date strings to Date objects
      const parsedPosts = res.data.map((post) => ({
        ...post,
        updatedAt: new Date(post.updatedAt),
      }));

      console.log("Parsed posts:", parsedPosts);

      // Sort the posts based on the getTime() method of Date objects
      const sortedPosts = parsedPosts.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      console.log("Sorted posts:", sortedPosts);

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

  return (
    <>
      <Navbar />
      <div>
        <h1 className="flex justify-center text-2xl font-bold my-4">
          All Blogs
        </h1>
        <div className="px-8 md:px-[200px] min-h-[80vh] pb-10">
          <div className="flex justify-center items-center mt-8 space-x-4">
            <div className="flex text-center items-center space-x-4">
              <input
                type="text"
                placeholder="Search...."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
          </div>
          {loader ? (
            <div className="h-[40vh] flex justify-center items-center">
              <Loader />
            </div>
          ) : !noResults ? (
            posts
              .filter(
                (post) =>
                  (!selectedCategory ||
                    post.categories.includes(selectedCategory)) &&
                  (!searchText ||
                    post.title
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    post.desc.toLowerCase().includes(searchText.toLowerCase()))
              )
              .map((post) => (
                <Link to={`/posts/post/${post._id}`} key={post._id}>
                  <HomePosts post={post} />
                </Link>
              ))
          ) : (
            <h3 className="text-center font-bold mt-16">No posts available</h3>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AllBlogs;

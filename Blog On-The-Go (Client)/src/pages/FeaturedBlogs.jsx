import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://blog-otg-backend.vercel.app" + "/api/posts")
      .then(async (response) => {
        console.log("Received data from the server:", response.data);

        // Sort blogs by length of description
        const sortedBlogs = response.data.sort((a, b) =>
          a.desc.length > b.desc.length ? -1 : 1
        );

        // Limit to the top 10 blogs
        const top10Blogs = sortedBlogs.slice(0, 10);

        // Fetch profile pictures for authors
        for (const blog of top10Blogs) {
          try {
            const userResponse = await axios.get(
              "https://blog-otg-backend.vercel.app" +
                "/api/users/" +
                blog.userId
            );
            blog.profilePic = userResponse.data.profilePicture;
          } catch (error) {
            console.error("Error fetching profile picture:", error);
          }
        }

        setFeaturedBlogs(top10Blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-8 md:px-[200px] mt-8 pb-10">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Top 10 Featured Blogs
        </h1>

        {loading ? (
          // Show loader while data is being fetched
          <div className="text-center">
            Loading...
            <Loader />
          </div>
        ) : (
          // Show table once data is loaded
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-center pr-8">Serial</th>
                <th className="text-center">Title</th>
                <th className="text-center px-8">Category</th>
                <th className="text-center pr-10">Description</th>
                <th className="text-center px-14">Author</th>
                <th className="text-center px-8">Profile Image</th>
              </tr>
            </thead>
            <tbody>
              {featuredBlogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-left font-bold">
                    <Link to={`/posts/post/${blog._id}`}>{blog.title}</Link>
                  </td>
                  <td className="text-center">{blog.categories[0]}</td>
                  <td className="text-left">
                    {blog.desc.length > 30
                      ? blog.desc.slice(0, 70) + "..."
                      : blog.desc}
                  </td>
                  <td className="text-center">{blog.displayName}</td>
                  <td className="text-center">
                    {blog.profilePic && (
                      <img
                        src={blog.profilePic}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FeaturedBlogs;

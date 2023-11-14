import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthProvider";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const { user } = useContext(AuthContext);
  const [cat, setCat] = useState("");
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app/api/post/" + id
      );
      console.log(res, "ssssssss");
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setImage(res.data.photo);
      setCat(res.data.categories[0]); // Assuming only one category is selected
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const post = {
      title,
      desc,
      displayName: user.displayName,
      profilePic: user.photoURL,
      userId: user.uid,
      categories: [cat],
      photo: image,
      updatedAt: new Date(),
    };

    try {
      const res = await axios.put(
        "https://blog-otg-backend.vercel.app/api/posts/" + id,
        post,
        {
          withCredentials: true,
        }
      );
      toast.success("Post updated successfully");
      console.log("edit", res.data._id);
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Error updating post");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8 mb-8">
        <h1 className="font-bold md:text-2xl text-xl">Update a post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 outline-none"
          />
          <input
            onChange={(e) => setImage(e.target.value)}
            value={image}
            type="text"
            placeholder="Enter image URL"
            className="px-4 py-2 outline-none"
          />
          <div className="flex items-center space-x-4 md:space-x-8">
            <input
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-4 py-2 outline-none"
              placeholder="Enter post category"
              type="text"
            />
          </div>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            rows={15}
            cols={30}
            className="px-4 py-2 outline-none"
            placeholder="Enter post description"
          />
          <button
            onClick={handleUpdate}
            className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
          >
            Update
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;

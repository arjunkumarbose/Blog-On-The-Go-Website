import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthProvider";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const { user, loading } = useContext(AuthContext);
  console.log("user", user);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const post = {
      title,
      desc,
      displayName: user.displayName,
      photo: image,
      profilePic: user.photoURL,
      userId: user.uid,
      categories: [cat],
      updatedAt: new Date(),
    };

    try {
      const res = await axios.post(
        "https://blog-otg-backend.vercel.app/api/posts/create",
        post,
        {
          withCredentials: true,
        }
      );

      console.log("response after creating", res);
      toast.success("Post created successfully");
      navigate("/posts/post/" + res.data.insertedId);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Error creating post");
    }
  };

  return (
    <>
      {loading ? (
        <span className="loading"></span>
      ) : user ? (
        <div>
          <Navbar />
          <div className="px-6 md:px-[200px] mt-8 mb-10">
            <h1 className="font-bold md:text-2xl text-xl ">Create a post</h1>
            <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter post title"
                className="px-4 py-2 outline-none"
              />

              <input
                onChange={(e) => setImage(e.target.value)}
                type="text"
                placeholder="Enter image URL"
                className="px-4 py-2 outline-none"
              />

              <div className="flex flex-col">
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="px-4 py-2 outline-none"
                >
                  <option value="">Select a category</option>
                  <option value="Photography">Photography</option>
                  <option value="Travel">Travel</option>
                  <option value="Games">Games</option>
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <textarea
                onChange={(e) => setDesc(e.target.value)}
                rows={15}
                cols={30}
                className="px-4 py-2 outline-none"
                placeholder="Enter post description"
              />
              <button
                onClick={handleCreate}
                className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
              >
                Create
              </button>
            </form>
          </div>
          <Footer />
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      ) : (
        // If user is not logged in, redirect to login page
        <Navigate to="/login"></Navigate>
      )}
    </>
  );
};

export default CreatePost;

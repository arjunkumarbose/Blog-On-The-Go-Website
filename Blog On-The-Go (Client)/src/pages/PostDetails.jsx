import { Navigate, useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthProvider";

const PostDetails = () => {
  const postId = useParams().id;
  console.log("psotdetails", postId);
  const [post, setPost] = useState({});
  const { user, loading } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [loadingTwo, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios
        .get("https://blog-otg-backend.vercel.app/api/post/" + postId)
        .then((res) => {
          console.log("jbfdfv", res.data);
          setPost(res.data);
          if (res?.data?.userId === user?.uid) {
            setIsAuthor(true);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      // console.log(res.data)
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(
        `https://blog-otg-backend.vercel.app/api/posts/${postId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Post deleted successfully");
      setTimeout(() => {
        navigate("/allblogs");
      }, 2000);
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Error deleting post");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId, user?.uid]);

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app/api/comments/post/" + postId
      );
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(true);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://blog-otg-backend.vercel.app/api/comments/create",
        {
          comment: comment,
          author: user.displayName,
          postId: postId,
          userId: user.uid,
          avatar: user.photoURL,
          createdAt: new Date(),
        },
        { withCredentials: true }
      );

      toast.success("Comment added successfully");
      setComment("");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Error adding comment");
    }
  };

  return (
    <>
      {loading ? (
        <span className="loading"></span>
      ) : user ? (
        <div>
          <Navbar />
          <div className="pb-20">
            {loader ? (
              <div className="h-[80vh] flex justify-center items-center w-full">
                <Loader />
              </div>
            ) : (
              <div className="px-8 md:px-[200px] mt-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold normal-case text-black md:text-3xl">
                    {post.title}
                  </h1>
                  {user?.uid === post?.userId && (
                    <div>
                      <div
                        className="flex items-center cursor-pointer justify-end text-green-400 font-bold"
                        onClick={() => navigate("/edit/" + postId)}
                      >
                        <p className="pr-2">Edit</p>
                        <p>
                          <BiEdit />
                        </p>
                      </div>
                      <div
                        className="flex items-center cursor-pointer justify-end text-red-400 font-bold"
                        onClick={() => handleDeletePost(postId)}
                      >
                        <p className="pr-2">Delete</p>
                        <p>
                          <MdDelete />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 md:mt-4">
                  <p>@{post.displayName}</p>
                  <div className="flex space-x-2">
                    <p>{new Date().toDateString().slice(0, 15)}</p>
                    <p>{new Date().toDateString().slice(16, 24)}</p>
                  </div>
                </div>
                <img src={post.photo} className="w-full  mx-auto mt-8" alt="" />
                <p className="mx-auto mt-8">{post.desc}</p>
                <div className="flex items-center mt-8 space-x-4 font-semibold">
                  <p>Categories:</p>
                  <div className="flex justify-center items-center space-x-2">
                    {post.categories?.map((c, i) => (
                      <>
                        <div
                          key={i}
                          className="bg-gray-300 rounded-lg px-3 py-1"
                        >
                          {c}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
                  {/* {comments?.map((c) => ( */}
                  <Comment postId={post._id} />
                  {/* ))} */}
                </div>
                {/* write a comment */}
                {loadingTwo ? (
                  <span className="loading"></span>
                ) : isAuthor ? (
                  <div className="text-center text-red-300">
                    As you are the author, you cannot comment in this post{" "}
                  </div>
                ) : (
                  <div className="w-full flex flex-col mt-4 md:flex-row">
                    <input
                      onChange={(e) => setComment(e.target.value)}
                      type="text"
                      placeholder="Write a comment"
                      className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"
                    />
                    <button
                      onClick={postComment}
                      className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0"
                    >
                      Add Comment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Footer />
        </div>
      ) : (
        <Navigate to="/login"></Navigate>
      )}
    </>
  );
};

export default PostDetails;

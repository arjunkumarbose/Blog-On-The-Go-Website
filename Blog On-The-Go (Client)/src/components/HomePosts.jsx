import { Link } from "react-router-dom";
import { BsBookmarkStarFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePosts = ({ post }) => {
  // This function checks if a post is in the wishlist
  const inWishlist = (postId) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      return wishlist.some((item) => item._id === postId);
    } catch (error) {
      console.error("Error checking wishlist:", error);
      toast.error("Error checking wishlist");
      return false;
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();

    if (inWishlist(post._id)) {
      // Remove from wishlist
      try {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist = wishlist.filter((item) => item._id !== post._id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        toast.success("Removed from Wishlist");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Error removing from Wishlist");
      }
    } else {
      // Add to wishlist
      try {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist.push(post);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        toast.success("Added to Wishlist");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Error adding to Wishlist");
      }
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="w-full flex mt-8 space-x-4">
      {/* left */}
      <div className="w-[35%] h-[200px] flex justify-center items-center">
        <img src={post.photo} alt="" className="h-full w-full object-cover" />
      </div>
      {/* right */}
      <div className="flex flex-col  w-[65%]">
        <div className="flex justify-between py-4">
          <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">
            {post.title}
          </h1>

          <button
            onClick={handleWishlistClick}
            className=" text-red-400 flex justify-center items-center"
          >
            {inWishlist(post._id) ? "Remove from Wishlist" : "Add to Wishlist"}
            <div className="ml-2">
              <BsBookmarkStarFill />
            </div>
          </button>
        </div>

        <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
          <p>
            Author: <b>{post.displayName}</b>
          </p>
          <p>
            Category: <b>{post.categories}</b>
          </p>
          <div className="flex space-x-2 text-sm">
            <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
            <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
          </div>
        </div>
        <p className="text-sm md:text-lg">
          {post.desc ? post.desc.slice(0, 20) + "..." : ""}
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default HomePosts;

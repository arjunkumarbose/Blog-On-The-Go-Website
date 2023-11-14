import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(AuthContext);

  const fetchComments = async () => {
    try {
      // Make sure to include the JWT token in the request headers if needed
      const response = await axios.get(
        `https://blog-otg-backend.vercel.app/api/comments/post/${postId}`,
        {
          // headers: {
          //   Authorization: `Bearer ${yourAuthTokenHere}`,
          // },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    try {
      // Make sure to include the JWT token in the request headers if needed
      await axios.post(
        "/api/comments",
        {
          postId: postId,
          text: newComment,
        },
        {
          // headers: {
          //   Authorization: `Bearer ${yourAuthTokenHere}`,
          // },
        }
      );
      setNewComment("");
      fetchComments(); // Refresh the comments after adding a new one
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Make sure to include the JWT token in the request headers if needed
      await axios.delete(
        `https://blog-otg-backend.vercel.app/api/comments/${commentId}`
      );
      fetchComments(); // Refresh the comments after deleting one
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      {/* <h2>Comments</h2> */}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} className="flex gap-4 justify-between">
            <div className="flex gap-2 items-center">
              <img
                src={comment.avatar}
                className="h-10 w-10 rounded-lg"
                alt=""
              />
              <div className="text-opacity-60">{comment.author}</div>
              <div className="font-bold">{comment.comment}</div>
            </div>
            {user?.uid == comment.userId ? (
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleDeleteComment(comment._id)}
              >
                Delete
              </button>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
      <div>
        {/* <h3>Add a Comment</h3> */}
        {/* <input type="text" value={newComment} onChange={handleCommentChange} /> */}
        {/* <button onClick={handleAddComment}>Add Comment</button> */}
      </div>
    </div>
  );
};

export default Comment;

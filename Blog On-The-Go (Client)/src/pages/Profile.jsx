import { useContext, useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const param = useParams().id;
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  // Initialize displayName with user.displayName if user is not null
  const [displayName, setdisplayName] = useState(user ? user.displayName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [newPassword, setNewPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app" + "/api/users/" + user.uid
      );
      setdisplayName(res.data.displayName);
      setEmail(res.data.email);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserUpdate = async () => {
    setUpdated(false);

    // Create a user object with updated data
    const updatedUser = {
      ...user,
      displayName,
      email,
      password: newPassword || user.password,
    };

    try {
      const res = await axios.put(
        "https://blog-otg-backend.vercel.app" + "/api/users/" + user.uid,
        updatedUser,
        {
          withCredentials: true,
        }
      );
      setUpdated(true);
      setUser(updatedUser);
    } catch (err) {
      console.log(err);
      setUpdated(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [param]);

  return (
    <div>
      <Navbar />
      <div className="min-h-[80vh] px-8 md:px-[200px] mt-8 flex md:flex-row flex-col-reverse md:items-start items-start">
        <div className="md:sticky md:top-12  flex justify-center md:justify-end items-start md:w-[30%] w-full md:items-end ">
          <div className=" flex flex-col space-y-5 items-start">
            <h1 className="text-xl font-bold mb-4">Profile</h1>
            <input
              onChange={(e) => setdisplayName(e.target.value)}
              value={displayName}
              className="outline-none px-4 py-2 text-gray-500"
              placeholder="Your displayName"
              type="text"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none px-4 py-2 text-gray-500"
              placeholder="Your email"
              type="email"
            />
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              className="outline-none px-4 py-2 text-gray-500"
              placeholder="New password (Leave empty to keep current password)"
              type="password"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
            />
            <div className="flex items-center space-x-4 mt-8">
              <button
                onClick={handleUserUpdate}
                className="text-white font-semibold bg-black px-4 py-2 hover:text-black hover-bg-gray-400"
              >
                Update
              </button>
            </div>
            {updated && (
              <h3 className="text-green-500 text-sm text-center mt-4">
                User updated successfully!
              </h3>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center md:w-[70%] w-full">
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Profile Picture"
              className="rounded-full h-32 w-32"
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

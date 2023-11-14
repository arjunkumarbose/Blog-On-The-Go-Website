import { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthProvider";
import app from "../../firebase.config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const auth = getAuth(app);

const Register = () => {
  const { CreateUserWithEmail, googleSignIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }

      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Email is invalid");
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
      if (!formData.password.trim() || !passwordRegex.test(formData.password)) {
        throw new Error(
          "Password must be at least 6 characters, contain at least one uppercase letter, and at least one symbol"
        );
      }

      const userCredential = await CreateUserWithEmail(
        formData.email,
        formData.password
      );
      const userInfo = userCredential.user;

      const imageUrl =
        formData.imageUrl.trim() ||
        "https://i.ibb.co/2vrDwGs/people-saving-money-24908-51568-transformed.jpg";

      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: imageUrl,
      });

      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        //navigate(from, { replace: true });
        //setRedirectToHome(true);
        navigate(location.state ? location.state : "/");
        window.location.reload();
      }, 5000);
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const googleSignInHandler = async () => {
    try {
      await googleSignIn();
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        navigate(location?.state ? location?.state : "/");
      }, 5000);
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <section className="bg-slate-600 ">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <form
            className="w-full max-w-md shadow-xl rounded-lg bg-slate-600 p-10"
            onSubmit={handleSignUp}
          >
            <div className="flex justify-center mx-auto">
              <img
                className="w-auto h-7 sm:h-8 text-black"
                src="/iconfinder-blog-4661578_122455.svg"
                alt=""
              />
            </div>

            <div className="relative flex items-center mt-8">
              <input
                type="text"
                name="name"
                id="name"
                className={`block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                placeholder="displayName"
                onChange={handleInputChange}
              />
            </div>

            <div className="relative flex items-center mt-4">
              <input
                type="email"
                name="email"
                id="email"
                className={`block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                placeholder="Email address"
                onChange={handleInputChange}
              />
            </div>

            <div className="relative flex items-center mt-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className={`block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                placeholder="Password"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-4 bottom-2 top-2 text-gray-400 dark:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {/* {showPassword ? <BiHide /> : <BiSolidShow />} */}
              </button>
            </div>

            <div className="relative flex items-center mt-4">
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                className={`block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40`}
                placeholder="Paste Image URL"
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6">
              <button
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-cyan-400 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                type="submit"
              >
                Sign Up
              </button>

              <div className="flex items-center justify-center mt-4">
                <button
                  type="button"
                  onClick={googleSignInHandler}
                  className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Sign up with Google
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                >
                  Already have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </section>
      <Footer />
    </div>
  );
};

export default Register;

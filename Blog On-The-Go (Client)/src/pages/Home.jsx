import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion"; // Import Framer Motion
import Loader from "../components/Loader";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperPlane } from "react-icons/fa6";
import { GiSelfLove } from "react-icons/gi";

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [email, setEmail] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDateTime(new Date());
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSubscribe = () => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(email)) {
      toast.error(
        "Email format is not correct. Please enter a valid email address.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
      return;
    }
    toast.success("Thank you for subscribing to our newsletter!", {
      position: "top-right",
      autoClose: 2000,
      onClose: () => {
        setEmail("");
      },
    });
  };

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        "https://blog-otg-backend.vercel.app/api/posts" + search
      );

      // Convert and parse date strings to Date objects
      const parsedPosts = res.data.map((post) => ({
        ...post,
        updatedAt: new Date(post.updatedAt),
      }));

      // Sort the posts based on the updatedAt field in descending order
      const sortedPosts = parsedPosts.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA; // Sort in descending order (newest first)
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

  useEffect(() => {
    fetchPosts();
  }, [search]);

  return (
    <>
      <motion.div // Animate the entire component
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        {/* Hero */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-white overflow-hidden relative lg:flex lg:items-center min-h-[80vh]"
          >
            <div>
              <div className="bg-white  overflow-hidden relative lg:flex lg:items-center min-h-[80vh]">
                <div className="w-full py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
                  <h2 className="text-3xl font-extrabold text-black  sm:text-4xl">
                    <span className="block">
                      <div className="flex justify-center items-center">
                        <div>Hello There! </div>
                        <div className="pl-2">
                          <GiSelfLove />
                        </div>
                      </div>
                    </span>
                  </h2>
                  <p className="flex justify-center items-center text-md mt-4 text-gray-400">
                    Read and share your favorite blog posts on the go!
                    <div className="pl-2">
                      <FaPaperPlane />
                    </div>
                  </p>
                  <div className="lg:mt-0 lg:flex-shrink-0">
                    <div className="mt-12 inline-flex rounded-md shadow"></div>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-8 lg:p-24">
                  <img
                    src="https://img.freepik.com/free-photo/full-shot-travel-concept-with-landmarks_23-2149153258.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1699228800&semt=ais"
                    className="w-1/2 rounded-lg"
                    alt="Tree"
                  />
                  <div>
                    <img
                      src="https://image.cnbcfm.com/api/v1/image/107185268-1674841615778-gettyimages-1457910259-a7404995.jpeg?v=1684929601"
                      className="mb-8 rounded-lg"
                      alt="Tree"
                    />
                    <img
                      src="https://blog.wego.com/wp-content/uploads/bangladesh-passport-fee-featured.webp"
                      className="rounded-lg"
                      alt="Tree"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Blogs */}
        <div className="my-8">
          <motion.div // Animate the Recent Blogs section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center items-center"
          >
            <h1 className="font-bold md:text-2xl text-xl">Recent Blogs</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="px-16"
          >
            {loader ? (
              <div className="h-[40vh] flex justify-center items-center">
                <Loader />
              </div>
            ) : !noResults ? (
              posts.slice(0, 3).map((post) => (
                <Link
                  to={!user ? `/posts/post/${post._id}` : "/login"}
                  key={post._id}
                >
                  <HomePosts post={post} />
                </Link>
              ))
            ) : (
              <h3 className="flex justify-center items-center text-lg text-red-400 text-center font-bold mt-16">
                No posts available!
                <div className="pl-2">
                  <GiPeaceDove />
                </div>
              </h3>
            )}
          </motion.div>
        </div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div>
            <section className="py-8 bg-black bg-gradient  md:py-16">
              <div className="box-content max-w-5xl px-5 mx-auto">
                <div className="flex flex-col items-center -mx-5 md:flex-row">
                  <div className="w-full px-5 mb-5 text-center md:mb-0 md:text-left">
                    <h6 className="text-xs font-semibold text-indigo-800 uppercase md:text-base dark:text-gray-100">
                      New Blogs Everyday!
                    </h6>
                    <h3 className="text-2xl font-bold text-white font-heading md:text-4xl">
                      {currentDateTime.toLocaleString()}
                    </h3>
                    <div className="w-full mt-4 md:w-44"></div>
                  </div>
                  <div className="w-full px-5 md:w-auto"></div>
                </div>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <section className="bg-white py-8">
            <div className="container px-4 py-16 mx-auto lg:flex lg:items-center lg:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl">
                Join us and get the update from anywhere!
              </h2>

              <div className="mt-8 lg:mt-0">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:-mx-2">
                  <input
                    id="email"
                    type="email"
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg sm:mx-2    focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button
                    className="px-6 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-black rounded-lg focus:ring focus:ring-blue-300 focus:ring-opacity-80 focus:outline-none sm:mx-2 hover:bg-blue-500"
                    onClick={handleSubscribe}
                  >
                    Get Started
                  </button>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Attention! Offer expires in 30 days. Make sure not to miss
                  this opportunity
                </p>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Owner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <section>
            <div className="bg-black  w-full mx-auto p-8">
              <img
                src="/icons8-blogger-48.png"
                className="w-10 h-10 m-auto mb-8"
              />
              <p className="text-gray-600  w-full md:w-2/3 m-auto text-center text-lg md:text-3xl">
                <span className="font-bold text-indigo-500">“</span>
                For a great blogging experience, maintain an active presence on
                your blog by posting fresh content regularly. Engage with your
                readers and create an enriching community.
                <span className="font-bold text-indigo-500">”</span>
              </p>
              <div className="flex items-center justify-center mt-8">
                <a href="#" className="relative block">
                  <img
                    alt="profil"
                    src="https://media.licdn.com/dms/image/D5603AQGYSC_I6bRq1w/profile-displayphoto-shrink_800_800/0/1691399297466?e=2147483647&v=beta&t=o24uKTK_5sOOuuT76NsnuYBDVX4wkUD_L8hy_MO6iys"
                    className="mx-auto object-cover rounded-full h-10 w-10 "
                  />
                </a>
                <div className="flex items-center justify-center ml-2">
                  <span className="mr-2 text-lg font-semibold text-indigo-500">
                    Arjun Kumar Bose
                  </span>
                  <span className="text-xl font-light text-gray-400">/</span>
                  <span className="ml-2 text-gray-400 text-md">
                    Owner of Blog On-The-Go!
                  </span>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Explore */}
        <motion.div // Animate the Explore section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <section>
            <div className="relative max-w-screen-xl p-4 px-4 mx-auto bg-white  sm:px-6 lg:px-8 py-26 lg:mt-20 my-10">
              <div className="relative">
                <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
                  <div className="ml-auto lg:col-start-2 lg:max-w-2xl">
                    <p className="text-base font-semibold leading-6 text-indigo-500 uppercase">
                      Explore
                    </p>
                    <h4 className="mt-2 text-2xl font-extrabold leading-8 text-gray-900  sm:text-3xl sm:leading-9">
                      Explore, Create, and Share with Blog On-The-Go!
                    </h4>
                    <p className="mt-4 text-lg leading-6 text-gray-500 ">
                      Build an interactive and dynamic blogging platform for you
                      and your team. It's the key to success in today's
                      fast-paced world. Collaborate, track, and stay connected
                      seamlessly.
                    </p>
                    <ul className="gap-6 mt-8 md:grid md:grid-cols-2">
                      <li className="mt-6 lg:mt-0">
                        <div className="flex">
                          <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full  ">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </span>
                          <span className="ml-4 text-base font-medium leading-6 text-gray-500 ">
                            Real-time Collaboration
                          </span>
                        </div>
                      </li>
                      <li className="mt-6 lg:mt-0">
                        <div className="flex">
                          <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full  ">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </span>
                          <span className="ml-4 text-base font-medium leading-6 text-gray-500 ">
                            Data Analytics
                          </span>
                        </div>
                      </li>
                      <li className="mt-6 lg:mt-0">
                        <div className="flex">
                          <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full ">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </span>
                          <span className="ml-4 text-base font-medium leading-6 text-gray-500 ">
                            24/7 Support
                          </span>
                        </div>
                      </li>
                      <li className="mt-6 lg:mt-0">
                        <div className="flex">
                          <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-green-800 bg-green-100 rounded-full ">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </span>
                          <span className="ml-4 text-base font-medium leading-6 text-gray-500 ">
                            Tips to Optimize Blogging
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="relative mt-10 lg:-mx-4 relative-20 lg:mt-0 lg:col-start-1">
                    <div className="relative space-y-4">
                      <div className="flex items-end justify-center space-x-4 lg:justify-start">
                        <img
                          className="w-32 rounded-lg shadow-lg md:w-56"
                          width="200"
                          src="https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="1"
                        />
                        <img
                          className="w-40 rounded-lg shadow-lg md:w-64"
                          width="260"
                          src="https://images.pexels.com/photos/5225282/pexels-photo-5225282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="2"
                        />
                      </div>
                      <div className="flex items-start justify-center ml-12 space-x-4 lg:justify-start">
                        <img
                          className="w-24 rounded-lg shadow-lg md:w-40"
                          width="170"
                          src="https://images.pexels.com/photos/4174168/pexels-photo-4174168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="3"
                        />
                        <img
                          className="w-32 rounded-lg shadow-lg md:w-56"
                          width="200"
                          src="https://images.pexels.com/photos/4314209/pexels-photo-4314209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Home;

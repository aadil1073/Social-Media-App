import Layout from '@/components/Layout'
import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '@/context'
import { useRouter } from 'next/router'
import axios from 'axios'
import UserRoute from '@/components/routes/UserRoute'
import CreatePost from '@/components/Post/CreatePost'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PostList from '@/components/Post/PostList'
import PeopleComp from '@/components/PeopleComp'
import FollowList from '@/components/FollowList'
import { MdMessage } from "react-icons/md";
import Link from 'next/link';

const dashboard = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [userStats, setUserStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
  });

const [showFollowModal, setShowFollowModal] = useState(false);
const [followList, setFollowList] = useState([]);
const [followType, setFollowType] = useState("following");

const openFollowModal = async (type) => {
  try {
    const { data } = await axios.get(`/follow-list/${type}`);
    setFollowList(data);
    setFollowType(type);
    setShowFollowModal(true);
  } catch (error) {
    console.error("Failed to fetch list:", error);
  }
};

 const updateUserAfterUnfollow = (updatedUser, removedUserId) => {
  setState(prev => {
    const newUser = {
      ...prev.user,
      followers: updatedUser.followers,
      following: updatedUser.following,
    };
    // Update localStorage token with new user
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', JSON.stringify({ ...prev, user: newUser }));
    }

    return { ...prev, user: newUser };
  });

  // Update stats
  setUserStats(prev => ({
    ...prev,
    followers: updatedUser.followers?.length || 0,
    following: updatedUser.following?.length || 0,
  }));

  // Remove from modal list
  setFollowList(prev => prev.filter(user => user._id !== removedUserId));
};



  const defaultImage = "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png"

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setUploading(false);
      setImage({ url: data.url, public_id: data.public_id });
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get("/user-post");

      setPosts(data);

      // Update stats only if user info exists
      if (state?.user?._id) {
        const myPostsCount = data.filter(post => post?.postedBy?._id === state.user._id).length;

        setUserStats({
          posts: myPostsCount,
          followers: state.user.followers?.length || 0,
          following: state.user.following?.length || 0
        });
      }
    } catch (error) {
      console.log(error);
    }
  };



  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/notifications");
      setNotifications(data);
    } catch (error) {
      console.log("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    if (state && state.token) {
      fetchUserPosts();
      findPeople();
      fetchNotifications();
    }
  }, [state && state.token]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/createpost", { content, image });
      fetchUserPosts();
      toast.success("Post Created");
      setImage({});
      setContent("");
    } catch (error) {
      toast.error("Error Try Again");
      console.log(error);
    }
  };

  const deleteHandler = async (post) => {
    try {
      const confirmDelete = window.confirm("Are you Sure?");
      if (!confirmDelete) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.success("Post Deleted!");
      fetchUserPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const updatePostInList = (updatedPost) => {
    setPosts(prev =>
      prev.map(post => post._id === updatedPost._id ? updatedPost : post)
    );
  };

  return (
    <Layout>
      <UserRoute>
        <div className="dashboard-container">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <div className="dashboard-left">
            <CreatePost
              content={content}
              setContent={setContent}
              handlePostSubmit={handlePostSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <PostList posts={posts} deleteHandler={deleteHandler} updatePostInList={updatePostInList} />
          </div>

          <div className="dashboard-right">

            {state?.user && (
              <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body text-center position-relative">
                  <Link href="/user/chat" className="position-absolute top-0 end-0 m-2">
                    <MdMessage size={20} color="black" />
                    {state.user.messageNotifications?.length > 0 && (
                      <span className="badge bg-danger">
                        {state.user.messageNotifications.length}
                      </span>
                    )}
                  </Link>
                  <img
                    src={state.user.image?.url || defaultImage}
                    alt="avatar"
                    className="rounded-circle border"
                    width="80"
                    height="80"
                  />
                  <h5 className="mt-2">{state.user.username}</h5>
                  {state.user.about && (<p className='text-muted small mt-1'>{state.user.about}</p>)}
                  <div className="d-flex justify-content-around mt-3">
                    <div>
                      <strong>{userStats.posts}</strong><br /><small>Posts</small>
                    </div>
                    <div style={{ cursor: "pointer" }} onClick={() => openFollowModal("followers")}>
                      <strong>{userStats.followers}</strong><br /><small>Followers</small>
                    </div>
                    <div style={{ cursor: "pointer" }} onClick={() => openFollowModal("following")}>
                      <strong>{userStats.following}</strong><br /><small>Following</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <h6 className="text-center text-secondary mb-3 mt-4">
              People you may know
            </h6>

            <PeopleComp people={people} setPeople={setPeople} setState={setState} />
          </div>
        </div>

        {showFollowModal && (
        <FollowList
          list={followList}
          type={followType}
          currentUserId={state.user._id}
          onClose={() => setShowFollowModal(false)}
          updateUser={updateUserAfterUnfollow}
        />
      )}
      </UserRoute>
    </Layout>
  );
};

export default dashboard;

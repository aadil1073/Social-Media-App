import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiSend } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
  const [state, setState] = useContext(UserContext);
  const [currentTab, setCurrentTab] = useState('');
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentTab(window.location.pathname);
    }
    if (state?.token) {
      fetchNotifications();
    }
  }, [state]);

const fetchNotifications = async () => {
  try {
    const { data } = await axios.get("/notifications");

    // Remove notifications where sender (from) is missing (user deleted)
    const validNotifications = data.filter(n => n.from && n.from._id);

    setNotifications(validNotifications);
  } catch (error) {
    console.log("Failed to fetch notifications", error);
  }
};


  const handleAccept = async (senderId) => {
    try {
      const { data } = await axios.put(`/accept-follow/${senderId}`, null, {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      // Update notifications and global user state
      setNotifications(data.notifications);
      setState((prev) => ({ ...prev, user: data }));

      // Update localStorage to persist state
      window.localStorage.setItem('auth', JSON.stringify({ ...state, user: data }));
    } catch (err) {
      console.error('Accept error', err);
    }
  };

const handleReject = async (senderId) => {
  try {
    const { data } = await axios.put(
      `/reject-follow/${senderId}`,
      {},
      {
        headers: { Authorization: `Bearer ${state.token}` },
      }
    );

    // Remove rejected notification
    setNotifications(prev =>
      prev.filter(n => n?.from?._id && n.from._id !== senderId)
    );

    toast.success("Follow request rejected");
  } catch (err) {
    console.error("Reject follow error:", err);

    // Remove invalid notification even if error (user deleted)
    setNotifications(prev =>
      prev.filter(n => n?.from?._id && n.from._id !== senderId)
    );

    toast.error("User no longer exists or request invalid");
  }
};



  const handleLogout = () => {
    window.localStorage.removeItem('auth');
    setState(null);
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center text-white">
          <FiSend size={24} className="me-2" />
          <span className="fw-bold">POstSphERe</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === '/' && 'active'}`} href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === '/about' && 'active'}`} href="/about">About</Link>
            </li>

            {state !== null ? (
              <>
                {/* Notifications */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link position-relative"
                    href="#"
                    id="notificationDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaBell />
                    {notifications.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {notifications.length}
                      </span>
                    )}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                    {notifications.length === 0 ? (
                      <li className="dropdown-item text-muted">No notifications</li>
                    ) : (
                      notifications.map((n) => (
                        <li key={n.from?._id || n._id || Math.random()} className="dropdown-item d-flex justify-content-between align-items-center">
                          <div>
                            <small>
                              <strong>{n.from?.name || "Unknown"}</strong> sent you a follow request
                            </small>
                          </div>
                          <div className="ms-2 d-flex gap-1">
                            <button className="btn btn-sm btn-success" onClick={() => handleAccept(n.from?._id)}>Accept</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleReject(n.from?._id)}>Cancel</button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    {state.user.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" href="/user/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/user/profile/update">Profile</Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={handleLogout} role="button">Logout</a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;

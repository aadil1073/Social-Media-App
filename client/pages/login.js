import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useContext } from 'react';
import { UserContext } from '@/context';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [state, setState] = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/login`, { email, password });

      setState({
        user: data.user,
        token: data.token,
      });

      window.localStorage.setItem('auth', JSON.stringify(data));
      setLoading(false);
      toast.success('Login successful');

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data || 'Login failed');
    }
  };

  if (state && state.token) router.push('/');

  return (
    <Layout title="Login">
      <div
        className="d-flex justify-content-center align-items-center position-relative overflow-hidden"
        style={{ minHeight: '100vh', background: 'linear-gradient(to right, #e0eafc, #cfdef3)' }}
      >
        {/* Background Shapes with Animation */}
        <style jsx>{`
          .shape {
            position: absolute;
            opacity: 0.25;
            z-index: 0;
            animation: float 8s ease-in-out infinite;
          }

          .circle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: white;
            top: 10%;
            left: 5%;
          }

          .diamond {
            width: 60px;
            height: 60px;
            background: white;
            transform: rotate(45deg);
            bottom: 18%;
            left: 8%;
            animation-delay: 1s;
          }

          .triangle {
            width: 0;
            height: 0;
            border-left: 35px solid transparent;
            border-right: 35px solid transparent;
            border-bottom: 60px solid white;
            top: 15%;
            right: 8%;
            animation-delay: 2s;
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}</style>

        <div className="shape circle" />
        <div className="shape diamond" />
        <div className="shape triangle" />

        {/* Login Card */}
        <div
          className="card shadow p-4 position-relative"
          style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', zIndex: 1 }}
        >
          <ToastContainer position="top-center" autoClose={3000} theme="colored" />
          <h2 className="text-center mb-4 text-dark fw-bold">Welcome Back 👋</h2>
          <p className="text-center text-muted mb-4">Log in to continue using PostSphere</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 btn-lg mb-3"
              disabled={!email || !password}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="d-flex justify-content-between">
              <small>
                New user?&nbsp;
                <Link href="/register" className="text-primary fw-semibold">Register</Link>
              </small>
              <small>
                <Link href="/forgot-password" className="text-danger fw-semibold">Forgot password?</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

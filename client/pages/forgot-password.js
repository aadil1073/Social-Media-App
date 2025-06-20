import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/forgot-password`, {
        email,
        newpassword,
        answer,
      });
      setLoading(false);
      toast.success('Password has been Reset');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/login');
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  if (state && state.token) router.push('/');

  return (
    <Layout>
      {/* SHAPE BACKGROUND */}
      <div className="forgot-wrapper">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            minHeight: '100vh',
            paddingTop: '60px',
            paddingBottom: '60px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            className="p-4 pt-5 pb-5 mt-5 mb-5 rounded shadow bg-white"
            style={{ width: '100%', maxWidth: '500px', zIndex: 3 }}
          >
            <h2 className="text-center mb-4 text-dark fw-bold fst-italic">Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <ToastContainer position="top-center" autoClose={3000} theme="colored" />
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control form-control-lg"
                  id="exampleInputEmail1"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control form-control-lg"
                  id="exampleInputPassword1"
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Security Question</label>
                <select className="form-select form-select-lg" defaultValue={'DEFAULT'}>
                  <option value="DEFAULT">Security Question</option>
                  <option value={1}>Enter your best friend name?</option>
                  <option value={2}>Enter your favourite food?</option>
                  <option value={3}>Enter your favourite sports?</option>
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Answer Here"
                  className="form-control form-control-lg"
                  id="exampleInputAnswer"
                />
              </div>
              <div className="d-flex flex-column gap-3">
                <button
                  type="submit"
                  className="btn btn-dark btn-lg"
                  disabled={!email || !newpassword || !answer}
                >
                  {loading ? (
                    <>
                      <span>loading &nbsp;</span>
                      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
                <p className="text-center mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                  Once submitted, you will be redirected to login with your new password.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* SHAPES */}
        <div className="shape shape-circle top-left"></div>
        <div className="shape shape-triangle bottom-right"></div>
        <div className="shape shape-diamond top-right"></div>
      </div>

      <style jsx>{`
        .forgot-wrapper {
          position: relative;
          background: linear-gradient(to bottom right, #e0f7fa, #e3f2fd);
          min-height: 100vh;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          opacity: 0.3;
          z-index: 1;
          animation: float 6s ease-in-out infinite;
        }

        .top-left {
          top: 30px;
          left: 30px;
        }

        .bottom-right {
          bottom: 40px;
          right: 40px;
        }

        .top-right {
          top: 80px;
          right: 60px;
        }

        .shape-circle {
          width: 100px;
          height: 100px;
          background: #00bcd4;
          border-radius: 50%;
        }

        .shape-triangle {
          width: 0;
          height: 0;
          border-left: 50px solid transparent;
          border-right: 50px solid transparent;
          border-bottom: 90px solid #fbc02d;
          animation-delay: 1s;
        }

        .shape-diamond {
          width: 70px;
          height: 70px;
          background: #d32f2f;
          transform: rotate(45deg);
          animation-delay: 0.5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }
      `}</style>
    </Layout>
  );
};

export default ForgotPassword;

import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context';

const register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        answer,
      });
      setLoading(false);
      toast.success(data.message);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/login');
    } catch (error) {
      toast.error(error?.response?.data || 'Registration failed.');
    }
  };

  if (state && state.token) router.push('/');

  return (
    <Layout title="Register">
      <div
        className="d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ minHeight: '100vh', background: 'linear-gradient(to right, #fceabb, #f8b500)' }}
      >
        {/* Animated Background Shapes */}
        <style jsx>{`
          .shape {
            position: absolute;
            opacity: 0.2;
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
            bottom: 20%;
            left: 12%;
            animation-delay: 1s;
          }

          .triangle {
            width: 0;
            height: 0;
            border-left: 35px solid transparent;
            border-right: 35px solid transparent;
            border-bottom: 60px solid white;
            top: 20%;
            right: 10%;
            animation-delay: 2s;
          }

          .img-shape {
            position: absolute;
            top: 30%;
            right: 30%;
            width: 100px;
            height: 100px;
            opacity: 0.15;
            animation: float 10s ease-in-out infinite;
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
        <img
          src="https://cdn-icons-png.flaticon.com/512/6814/6814049.png"
          alt="register-shape"
          className="img-shape"
        />

        {/* Register Form */}
        <div
          className="p-4 pt-5 pb-5 mt-5 mb-5 rounded shadow bg-white" 
          style={{ width: '100%', maxWidth: '500px', zIndex: 1 }}
        >
          <h2 className="text-center mb-4 text-dark fw-bold fst-italic">Register</h2>
          <form onSubmit={handleSubmit}>
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

            <div className="mb-3">
              <label htmlFor="exampleInputName1" className="form-label fw-semibold">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control form-control-lg"
                id="exampleInputName1"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label fw-semibold">
                Email address
              </label>
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
              <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg"
                id="exampleInputPassword1"
                placeholder="Enter your password"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Security Question</label>
              <select
                className="form-select form-select-lg"
                defaultValue={'DEFAULT'}
                aria-label="Default select example"
              >
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
                disabled={!name || !email || !password || !answer}
              >
                {loading ? (
                  <>
                    <span>loading &nbsp;</span>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  </>
                ) : (
                  'Register'
                )}
              </button>

              <p className="text-center mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                Your information is safe with us. We respect your privacy.
              </p>

              <p className="text-center mt-3">
                Already Registered?{' '}
                <Link href="/login" className="fw-semibold text-decoration-none text-primary">
                  Login!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default register;

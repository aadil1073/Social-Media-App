import React, { useContext } from 'react';
import { UserContext } from '@/context';
import Layout from '@/components/Layout';

const Home = () => {
  const [state] = useContext(UserContext);

  return (
    <Layout>
      <div
        className="text-center d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden"
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '40px 10px',
          background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        }}
      >
        {/* Animated Background Shapes */}
        <div className="home-bg-shape circle-shape"></div>
        <div className="home-bg-shape triangle-shape"></div>
        <div className="home-bg-shape diamond-shape"></div>

        {/* Content */}
        <h1 className="fw-bold fst-italic fade-in" style={{ color: '#212529' }}>
          Welcome to <span style={{ color: 'purple' }}>PostSphere</span>
        </h1>

        <p className="fst-italic fs-5 w-75 text-dark fade-in">
          "Bringing people together, one post at a time. Discover, share, and connect with like-minded individuals."
        </p>

        {state && state.user && (
          <div className="d-flex align-items-center mt-3 fade-in">
            <h5 className="fw-bold fst-italic me-2 text-dark">
              Hello, <span style={{ color: 'purple' }}>{state.user.name}</span> 👋 — Glad to see you here!
            </h5>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User Icon"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid #ccc',
              }}
            />
          </div>
        )}
      </div>

      {/* Styles and Animations */}
      <style jsx>{`
        .home-bg-shape {
          position: absolute;
          z-index: 0;
          opacity: 0.15;
          animation: float 6s ease-in-out infinite;
        }

        .circle-shape {
          top: 10%;
          left: 5%;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #a78bfa;
        }

        .triangle-shape {
          bottom: 15%;
          right: 10%;
          width: 0;
          height: 0;
          border-left: 60px solid transparent;
          border-right: 60px solid transparent;
          border-bottom: 100px solid #34d399;
          animation-delay: 2s;
        }

        .diamond-shape {
          top: 25%;
          right: 20%;
          width: 80px;
          height: 80px;
          background: #f472b6;
          transform: rotate(45deg);
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }

        .fade-in {
          opacity: 0;
          animation: fadeInUp 1.2s ease forwards;
        }

        .fade-in:nth-child(2) {
          animation-delay: 0.3s;
        }

        .fade-in:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes fadeInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;

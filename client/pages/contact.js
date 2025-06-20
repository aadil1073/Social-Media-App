import React from 'react';
import Layout from '@/components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const res = await fetch('https://formspree.io/f/mqablzjl', {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        toast.success('Message sent successfully!');
        form.reset();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="position-relative d-flex justify-content-center align-items-center min-vh-100 custom-bg overflow-hidden">
        {/* Background animated shapes */}
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>

        {/* Contact Form Card */}
        <motion.div
          className="card shadow-lg p-4 bg-white"
          style={{ width: '100%', maxWidth: '600px', zIndex: 1 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-center mb-4 text-dark fw-bold">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">Subject</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter subject"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label fw-semibold">Message</label>
              <textarea
                name="message"
                className="form-control"
                rows="5"
                placeholder="Your message"
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">Send Message</button>
          </form>
          <ToastContainer />
        </motion.div>

        {/* CSS for background + animation */}
        <style jsx>{`
          .custom-bg {
            background: linear-gradient(135deg, #fdf2f8, #e0f7fa);
          }

          .floating-shape {
            position: absolute;
            border-radius: 50%;
            opacity: 0.25;
            filter: blur(4px);
            z-index: 0;
            animation: float 10s infinite ease-in-out;
          }

          .shape1 {
            width: 140px;
            height: 140px;
            background-color: #ff6b6b; /* Coral Pink */
            top: 10%;
            left: 5%;
            animation-delay: 0s;
          }

          .shape2 {
            width: 180px;
            height: 180px;
            background-color: #6bcfff; /* Aqua Blue */
            bottom: 5%;
            right: 10%;
            animation-delay: 2s;
          }

          .shape3 {
            width: 100px;
            height: 100px;
            background-color: #7fffd4; /* Mint Green */
            bottom: 20%;
            left: 30%;
            animation-delay: 4s;
          }

          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-25px) rotate(180deg);
            }
            100% {
              transform: translateY(0) rotate(360deg);
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Contact;

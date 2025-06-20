import React from "react";
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout title="About">
      <div
        className="container py-5 px-4 mb-5" 
        style={{
          maxWidth: "800px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginTop: "50px",
        }}
      >
        <h1 className="mb-4 text-center fw-bold" style={{ fontSize: "2.5rem", color: "#212529" }}>
          About PostSphere
        </h1>

        <p className="lead text-muted text-center mb-4">
          Where real people meet, share, and grow — all in one space.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#343a40" }}>
          <strong>PostSphere</strong> is a community-driven platform designed to make meaningful digital
          connections. Whether you're here to share life updates, discover new ideas, or simply stay in
          touch — SocialConnect is your social home.
        </p>

        <div className="mt-4">
          <h5 className="fw-semibold mb-3">✨ Key Features</h5>
          <ul className="list-unstyled text-secondary">
            <li className="mb-2">• Create rich posts with images and captions</li>
            <li className="mb-2">• Follow users to build your social circle</li>
            <li className="mb-2">• Like and comment to engage in real conversations</li>
            <li className="mb-2">• Personalized home feed based on who you follow</li>
            <li className="mb-2">• Secure authentication and profile management</li>
          </ul>
        </div>

        <div className="mt-4 text-muted fst-italic text-center" style={{ fontSize: "0.95rem" }}>
          SocialConnect was built with 💙 in 2025 using the MERN stack (MongoDB, Express, React, Node.js) — 
          by developers who believe in the power of connection.
        </div>
      </div>
    </Layout>
  );
};

export default About;

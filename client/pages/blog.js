import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const dummyPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    summary: 'Learn the basics of React, JSX, and components to build powerful UIs.',
    slug: '/blog/react-intro',
    date: 'June 10, 2025',
  },
  {
    id: 2,
    title: 'Deploy Your MERN App to Vercel',
    summary: 'Step-by-step guide to deploy your full stack MERN application using Vercel.',
    slug: '/blog/deploy-mern-vercel',
    date: 'June 12, 2025',
  },
  {
    id: 3,
    title: 'Integrate Cloudinary with Node.js',
    summary: 'Upload and manage media files easily with Cloudinary in your backend.',
    slug: '/blog/cloudinary-node',
    date: 'June 13, 2025',
  },
  {
    id: 4,
    title: 'JWT Authentication in Express',
    summary: 'Secure your backend routes using JSON Web Tokens in a clean and scalable way.',
    slug: '/blog/jwt-auth-express',
    date: 'June 14, 2025',
  },
  {
    id: 5,
    title: 'Using React Context API',
    summary: 'Simplify your state management by using the built-in Context API.',
    slug: '/blog/react-context',
    date: 'June 15, 2025',
  },
  {
    id: 6,
    title: 'Build a Responsive Navbar in Next.js',
    summary: 'Create a professional and responsive navigation bar using Bootstrap or Tailwind.',
    slug: '/blog/navbar-nextjs',
    date: 'June 16, 2025',
  },
];

const Blog = () => {
  return (
    <Layout>
      <div className="blog-page py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-white display-5">📝 Latest Blog Posts</h2>
          <div className="row g-4">
            {dummyPosts.map((post) => (
              <div key={post.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow blog-card">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{post.title}</h5>
                    <p className="text-muted small">{post.date}</p>
                    <p className="card-text flex-grow-1">{post.summary}</p>
                    <Link href={post.slug} className="btn btn-dark mt-auto rounded-pill px-4">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-page {
          background: linear-gradient(to right, #e0eafc, #cfdef3);
          min-height: 100vh;
        }

        .blog-card {
          border-radius: 20px;
          transition: all 0.3s ease-in-out;
          border: none;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .card-title {
          color: #343a40;
        }

        .btn-dark {
          background-color: #343a40;
          border: none;
        }

        .btn-dark:hover {
          background-color: #23272b;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;

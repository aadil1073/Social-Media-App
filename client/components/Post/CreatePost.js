import React from 'react';
import dynamic from 'next/dynamic'; // ssr false
import { FaCameraRetro } from "react-icons/fa6";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CreatePost = ({ content, setContent, handlePostSubmit, handleImage, image, uploading }) => {
  return (
    <>
      <div className="card mt-4 border-0 shadow-sm" style={{ borderRadius: "16px", background: "#fefefe" }}>
        <div className="p-3">
          <ReactQuill
            className="form-control border-0"
            style={{ minHeight: "120px", backgroundColor: "#fff", borderRadius: "12px", padding: "8px" }}
            value={content}
            onChange={(e) => setContent(e)}
            placeholder="Share what's on your mind..."
            id="floatingTextarea"
          />
        </div>
        <div className="d-flex justify-content-between align-items-center px-3 pb-3 pt-2">
          <label
            htmlFor="image"
            className="d-flex align-items-center gap-2"
            style={{
              cursor: 'pointer',
              backgroundColor: "#f1f1f1",
              padding: "6px 10px",
              borderRadius: "8px"
            }}
          >
            {image && image.url ? (
              <img
                src={image.url}
                height={36}
                width={36}
                className="rounded-circle border"
                alt="uploaded"
              />
            ) : uploading ? (
              <div className="spinner-border text-primary" role="status" style={{ height: '1.5rem', width: '1.5rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <FaCameraRetro size={22} className="text-muted" />
            )}
            <input
              type="file"
              accept="images/*"
              onChange={handleImage}
              name="image"
              id="image"
              hidden
            />
          </label>

          <button
            disabled={!content}
            onClick={handlePostSubmit}
            className="btn"
            style={{
              width: '140px',
              fontWeight: 500,
              borderRadius: "8px",
              padding: "8px 12px",
              letterSpacing: "0.5px",
              backgroundColor: "purple",
              color: "#fff"
            }}
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePost;

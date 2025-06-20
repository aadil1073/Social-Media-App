import React, { useContext, useState } from 'react';
import moment from 'moment/moment';
import { useRouter } from 'next/router';
import renderHTML from 'react-render-html';
import PostImage from './PostImage';
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaRegCommentAlt, FaRegEdit } from "react-icons/fa";
import { FaTrash, FaPaperPlane } from "react-icons/fa6";
import { UserContext } from '@/context';
import axios from 'axios';

const PostList = ({ posts, deleteHandler, updatePostInList }) => {
  const defaultImage = "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png";
  const router = useRouter();
  const [state] = useContext(UserContext);
  const [commentText, setCommentText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleLike = async (postId) => {
    try {
      const { data } = await axios.put("/like", { postId });
      updatePostInList(data);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleComment = async (postId) => {
    try {
      const { data } = await axios.put("/comment", {
        postId,
        comment: commentText[postId]
      });
      updatePostInList(data);
      setCommentText({ ...commentText, [postId]: "" });
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleDeleteComment = async (postId, comment) => {
    try {
      const { data } = await axios.put("/uncomment", { postId, comment });
      updatePostInList(data);
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  const handleEditComment = async (postId, commentId, newText) => {
    try {
      const { data } = await axios.put("/edit-comment", {
        postId,
        commentId,
        newText,
      });
      updatePostInList(data);
      setEditingCommentId(null);
    } catch (err) {
      console.error("Edit comment error:", err);
    }
  };

  const startEditing = (id, text) => {
    setEditingCommentId(id);
    setCommentText(prev => ({ ...prev, [id]: text }));
  };

  return (
    <>
      {posts.map(post => (
        <div key={post._id} className="card mb-5">
          <div className="card-header d-flex align-items-center">
            <img
              src={post.postedBy && post.postedBy.image?.url ? post.postedBy.image.url : defaultImage}
              alt="user"
              height={30}
              width={30}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
            <span className='ms-2 fw-semibold'>{post.postedBy?.name || "Unknown User"}</span>
            <span className='ms-3 text-muted'>{moment(post.createdAt).fromNow()}</span>
          </div>

          <div className="card-body">
            {renderHTML(post.content)}
            <PostImage url={post.image?.url} />
          </div>

          <div className="card-footer">
            <div className='d-flex flex-row align-items-center mb-2'>
              <span onClick={() => handleLike(post._id)} style={{ cursor: "pointer" }}>
                {post.likes.includes(state.user._id)
                  ? <IoIosHeart color='red' size={25} />
                  : <IoIosHeartEmpty color='red' size={25} />}
              </span>
              <span className='ms-1'>{post.likes.length} Likes</span>
              <span className='ms-4'><FaRegCommentAlt size={20} /> {post.comment.length} Comments</span>
              {state?.user?._id && post?.postedBy?._id && state.user._id === post.postedBy._id && (
                <div className='ms-auto d-flex'>
                  <FaRegEdit size={20} className="me-3" style={{ cursor: "pointer" }} onClick={() => router.push(`/user/post/${post._id}`)} />
                  <FaTrash color="red" size={20} style={{ cursor: "pointer" }} onClick={() => deleteHandler(post)} />
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className='d-flex'>
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
              />
              <button
                className="btn btn-primary ms-2 d-flex align-items-center justify-content-center"
                style={{ minWidth: "40px", padding: "6px 10px" }}
                onClick={() => handleComment(post._id)}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>

            {/* Display Comments */}
            <div className="mt-3">
              {post.comment.map((c) => (
                <div key={c._id} className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-start">
                    <img
                      src={c.postedBy?.image?.url || defaultImage}
                      alt="comment-user"
                      height={28}
                      width={28}
                      style={{ borderRadius: "50%", marginRight: "8px" }}
                    />
                    <div>
                      <strong>{c.postedBy?.name || "Unknown"}</strong>
                      {editingCommentId === c._id ? (
                        <div className="mt-1 d-flex">
                          <input
                            type="text"
                            className="form-control"
                            value={commentText[c._id] || ""}
                            onChange={(e) => setCommentText({ ...commentText, [c._id]: e.target.value })}
                          />
                          <button
                            className="btn btn-sm btn-success ms-2"
                            onClick={() => handleEditComment(post._id, c._id, commentText[c._id])}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1">{c.text}</div>
                      )}
                    </div>
                  </div>

                  {state.user._id === c.postedBy?._id && (
                    <div className="d-flex gap-2">
                      <FaRegEdit
                        size={16}
                        style={{ cursor: "pointer" }}
                        className="text-warning"
                        onClick={() => startEditing(c._id, c.text)}
                      />
                      <FaTrash
                        size={16}
                        style={{ cursor: "pointer" }}
                        className="text-danger"
                        onClick={() => handleDeleteComment(post._id, c)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostList;

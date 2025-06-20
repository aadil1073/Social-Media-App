import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FollowList = ({ list, type, onClose, currentUserId, updateUser}) => {
  const handleUnfollow = async (userId) => {
  const confirmUnfollow = window.confirm("Are you sure you want to unfollow this user?");
  if (!confirmUnfollow) return;

  try {
    const { data } = await axios.put(`/unfollow/${userId}`);
    updateUser(data, userId); 
    toast.success("Unfollowed successfully");
  } catch (error) {
    console.error("Unfollow error:", error);
    toast.error("Failed to unfollow");
  }
};

  const handleMessage = (userId) => {
    // Replace this with navigation or chat popup
    alert(`Open chat with user ID: ${userId}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h5>{type === 'followers' ? "Followers" : "Following"}</h5>
        <ul className="list-group">
          {list.length === 0 ? (
            <div className='text-center text-muted py-4'>No User Found</div>
          ) : (
            list.map(user => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center ps-2">
                <img
                  src={user.image?.url || "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png"}
                  alt={user.username}
                />
                <span>{user.username}</span>
              </div>

              <div>
                {type === 'following' && user._id !== currentUserId && (
                  <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleUnfollow(user._id)}>
                    Unfollow
                  </button>
                )}
                {type === 'followers' && user._id !== currentUserId && (
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleMessage(user._id)}>
                    Message
                  </button>
                )}
              </div>
            </li>
          ))
          )}
        </ul>

        <div className="text-end">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FollowList;

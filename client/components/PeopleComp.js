import React, { useContext, useState } from 'react';
import { UserContext } from '@/context';
import { useRouter } from 'next/router';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';

const PeopleComp = ({ people }) => {
  const [state] = useContext(UserContext);
  const [requested, setRequested] = useState({});

  const defaultImage =
    'https://tse2.mm.bing.net/th?id=OIP.OVpTgUcb_jvg9ky0qIHNKAHaHa&pid=Api&P=0&h=180';

  const handleFollow = async (userId) => {
    try {
      await axios.put(`/follow-request/${userId}`);
      toast.success("Follow request sent");
      setRequested(prev => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to send follow request");
    }
  };

  return (
    <div className="mt-4">
      {people.map((user) => (
        <div
          className="card p-3 mb-3 shadow-sm border-0"
          key={user._id}
          style={{ borderRadius: '12px' }}
        >
          <div className="d-flex align-items-center gap-3">
            <img
              src={user.image && user.image.url ? user.image.url : defaultImage}
              alt={user.name}
              height={50}
              width={50}
              className="rounded-circle border"
            />
            <div className="flex-grow-1">
              <h6 className="mb-0 fw-semibold">{user.name}</h6>
              <small className="text-muted">Joined {moment(user.createdAt).fromNow()}</small>
            </div>
            <button
              className="btn btn-sm btn-outline-primary px-3"
              onClick={() => handleFollow(user._id)}
              disabled={requested[user._id]}
            >
              {requested[user._id] ? "Requested" : "Follow"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PeopleComp;
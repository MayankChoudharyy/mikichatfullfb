import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/auth/me', {
      headers: { Authorization: localStorage.getItem('token') },
    })
    .then(res => {
      setFriends(res.data.friends || []);
    })
    .catch(() => {
      navigate('/');
    });
  }, []);

  return (
    <div>
      <h2>Miki Dashboard</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend._id} onClick={() => navigate(`/chat/${friend._id}`)}>
            {friend.name || friend.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

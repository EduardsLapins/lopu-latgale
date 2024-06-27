// src/components/Uzdevumi.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Uzdevumi = () => {
  const [tasks, setTasks] = useState([]);
  const [cookies] = useCookies(['team']);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks?team=${cookies.team}`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the tasks!", error);
      });
  }, [cookies.team]);

  return (
    <div>
      <h1>Uzdevumi</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name} - {task.locked ? 'Locked' : 'Unlocked'}
            {task.locked ? null : (
              <div>
                <button>Submit Photo</button>
                <button>Submit Video</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Uzdevumi;

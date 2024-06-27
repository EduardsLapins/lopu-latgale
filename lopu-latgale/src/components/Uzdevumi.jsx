import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import FileUpload from './FileUpload';
import TaskDetails from './TaskDetails';

const Uzdevumi = () => {
    const [tasks, setTasks] = useState([]);
    const [cookies] = useCookies(['team']);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const apiURL = `http://${process.env.REACT_APP_PROJECT_DOMAIN}/api/tasks?team=${cookies.team}`;

        axios.get(apiURL)
            .then(response => {
                console.log('API response:', response.data);
                if (Array.isArray(response.data)) {
                    setTasks(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setTasks([]);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the tasks!", error);
                setTasks([]); // Ensure tasks is an array even if the API call fails
            });
    }, [cookies.team]);


    return (
        <div>
            <h1>Uzdevumi</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.name} - {task.locked ? 'Locked' : 'Unlocked'}
                        {task.locked ? null : <FileUpload task={task.name} />}
                        {task.locked ? null : <button onClick={() => setSelectedTask(task.name)}>View Details</button>}
                    </li>
                ))}
            </ul>
            {selectedTask && <TaskDetails task={selectedTask} />}
        </div>
    );
};

export default Uzdevumi;

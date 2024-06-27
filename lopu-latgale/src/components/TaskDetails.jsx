import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const TaskDetails = ({ task }) => {
    const [details, setDetails] = useState(null);
    const [cookies] = useCookies(['team']);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const apiURL = `http://${process.env.REACT_APP_PROJECT_DOMAIN}/api/task-details?team=${cookies.team}&task=${task}`;
        
        axios.get(apiURL)
            .then(response => {
                setDetails(response.data);
                setSelectedFile(response.data.selectedFile);
            })
            .catch(error => {
                console.error('Error fetching task details:', error);
            });
    }, [cookies.team, task]);

    const handleFileSelection = (file) => {
        const apiURL = `http://${process.env.REACT_APP_PROJECT_DOMAIN}/api/select-task-file`;
        axios.post(apiURL, { team: cookies.team, task, selectedFile: file })
            .then(response => {
                setSelectedFile(file);
            })
            .catch(error => {
                console.error('Error selecting task file:', error);
            });
    };

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Task {task} Details</h2>
            <p>{details.description}</p>
            <h3>Files:</h3>
            <ul>
                {details.files.map(file => (
                    <li key={file.name}>
                        <button onClick={() => handleFileSelection(file.name)}>{file.name}</button>
                    </li>
                ))}
            </ul>
            {selectedFile && (
                <div>
                    <h3>Selected File:</h3>
                    <a href={details.files.find(f => f.name === selectedFile).url} target="_blank" rel="noopener noreferrer">
                        {selectedFile}
                    </a>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;

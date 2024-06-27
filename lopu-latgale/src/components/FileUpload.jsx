import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const FileUpload = ({ task }) => {
    const [file, setFile] = useState(null);
    const [cookies] = useCookies(['team']);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const apiURL = `https://${process.env.REACT_APP_PROJECT_DOMAIN}/upload?team=${cookies.team}&task=${task}`;
            const response = await axios.post(apiURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h2>Upload File for {task}</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;

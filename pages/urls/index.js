import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const UrlsIndex = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.get('http://localhost:4000/urls');
        setUrls(response.data);
        console.log(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          if (error.response.status === 404) {
            setError('No URLs found.');
          } else {
            setError('Error fetching URLs.');
          }
        } else if (error.request) {
          console.error('Error request:', error.request);
          setError('No response received from server.');
        } else {
          console.error('Error message:', error.message);
          setError('Error setting up request.');
        }
        console.error('Error config:', error.config);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div>
      <h1>All URLs</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {urls.map((url) => (
            <li key={url.short_id}>
              <a href={`http://localhost:4000/${url.short_id}`}>{url.short_id}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UrlsIndex;

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const AnalyticsIndex = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.get('http://localhost:4000/urls');
        setUrls(response.data);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          if (error.response.status === 404) {
            setError('No URLs found.');
          } else {
            setError('Error fetching URLs.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          setError('No response received from server.');
        } else {
          // Something happened in setting up the request that triggered an Error
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
      <h1>All Created URLs</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {urls.map((url) => (
            <li key={url.short_id}>
              <Link href={`/analytics/${url.short_id}`}>
                <span>{url.long_url}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalyticsIndex;

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const AnalyticsIndex = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query GetUrls {
              urls {
                id
                long_url
                short_id
                custom_id
                created_at
                updated_at
              }
            }
          `,
        });
        setUrls(response.data.data.urls);
      } catch (error) {
        console.error('Error fetching URLs:', error.response?.data || error.message);
        setError('Error fetching URLs.');
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

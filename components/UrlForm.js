import { useState } from 'react';
import axios from 'axios';

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          mutation ShortenUrl($long_url: String!, $custom_id: String) {
            shortenUrl(long_url: $long_url, custom_id: $custom_id) {
              short_id
              long_url
            }
          }
        `,
        variables: {
          long_url: longUrl,
          custom_id: customId || null,
        },
      });
      setShortUrl(`http://localhost:4000/${response.data.data.shortenUrl.short_id}`);
    } catch (error) {
      console.error('Error shortening URL:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter long URL"
          required
        />
        <input
          type="text"
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          placeholder="Custom short URL (optional)"
        />
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <div>
          <p>Short URL:</p>
          <a href={shortUrl}>{shortUrl}</a>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
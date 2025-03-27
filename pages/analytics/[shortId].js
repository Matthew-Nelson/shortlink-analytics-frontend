import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const router = useRouter();
  const { shortId } = router.query;
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query GetClicks($shortId: String!) {
              url(short_id: $shortId) {
                clicks {
                  id
                  timestamp
                  location
                  referrer
                }
              }
            }
          `,
          variables: {
            shortId: shortId, // Pass the shortId dynamically
          },
        });
    
        // Extract the clicks data from the response
        setClicks(response.data.data.url.clicks);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (shortId) {
      fetchAnalytics();
    }
  }, [shortId]);

  const chartData = {
    labels: clicks.map((click) => new Date(click.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Clicks',
        data: clicks.map((click) => 1),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h1>Analytics for {shortId}</h1>
      <Bar data={chartData} />
    </div>
  );
};

export default Analytics;
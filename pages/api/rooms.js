// Next.js API route to proxy requests to backend for rooms

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://luxuryhotelbackend.onrender.com/api';
      const { id } = req.query;
      
      let url = `${backendUrl}/rooms`;
      if (id) {
        url += `/${id}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch rooms' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
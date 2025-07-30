// Next.js API route to proxy requests to backend

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://luxuryhotelbackend.onrender.com/api';
  
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${backendUrl}/bookings`);
      const data = await response.json();
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const response = await fetch(`${backendUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ success: false, message: 'Failed to create booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
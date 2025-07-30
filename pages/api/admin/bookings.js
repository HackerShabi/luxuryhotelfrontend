const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || '',
          'x-admin-key': req.headers['x-admin-key'] || 'admin123'
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        return res.status(response.status).json(data)
      }

      res.status(200).json(data)
    } catch (error) {
      console.error('Admin bookings API error:', error)
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch admin bookings',
        error: error.message 
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const { id } = req.query

    const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}/read`, {
      method: 'PATCH',
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
    console.error('Error marking contact as read:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
}
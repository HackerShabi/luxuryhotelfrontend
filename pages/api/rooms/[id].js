const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://luxuryhotelbackend.onrender.com/api'

export default async function handler(req, res) {
  const { id } = req.query
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`)
    
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Room not found' })
    }
    
    const room = await response.json()
    res.status(200).json(room)
  } catch (error) {
    console.error('Error fetching room:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
import { UserProfile } from '@/interfaces/profile.interfaces'

const API_BASE_URL = 'https://backend-learnbridge.onrender.com/api'

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
})

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile/getprofile`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.')
      }
      throw new Error('Failed to fetch profile')
    }
    
    const data = await response.json()
    return data.user
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile/updateprofile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.')
      }
      throw new Error('Failed to update profile')
    }

    const result = await response.json()
    return result.user
  }
}
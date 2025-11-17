// services/favorites.service.ts
import { FavoriteItem, FavoritesResponse, RemoveFavoriteRequest, ProfilePicture } from '@/interfaces/favorites.interfaces';

class FavoritesService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private getToken(): string {
    if (typeof window === 'undefined') {
      throw new Error("Cannot access localStorage on server side");
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }

    return token;
  }

  private async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Helper function to normalize profile picture data
  private normalizeProfilePicture(profilePicture: any): ProfilePicture | undefined {
    if (!profilePicture) {
      return undefined;
    }
    
    // Handle empty objects (like {})
    if (typeof profilePicture === 'object' && Object.keys(profilePicture).length === 0) {
      return undefined;
    }
    
    // Handle Cloudinary response object
    if (profilePicture.url && typeof profilePicture.url === 'string' && profilePicture.url.trim() !== '') {
      return {
        url: profilePicture.url,
        public_id: profilePicture.public_id || '',
        format: profilePicture.format || 'jpg',
        bytes: profilePicture.bytes || 0
      };
    }
    
    // Handle string URLs (convert to ProfilePicture object)
    if (typeof profilePicture === 'string' && profilePicture.trim() !== '') {
      return {
        url: profilePicture,
        public_id: '',
        format: 'jpg',
        bytes: 0
      };
    }
    
    return undefined;
  }

  async getFavorites(): Promise<FavoriteItem[]> {
    const data = await this.fetchWithAuth<FavoritesResponse>(`${this.baseUrl}/favorites/getfave`);
    
    // Normalize the favorites data to include profile pictures
    return (data.favorites || []).map(favorite => ({
      ...favorite,
      tutor: favorite.tutor ? {
        ...favorite.tutor,
        profilePicture: this.normalizeProfilePicture(favorite.tutor.profilePicture)
      } : undefined
    }));
  }

  async removeFavorite(request: RemoveFavoriteRequest): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/removefave`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const favoritesService = new FavoritesService();
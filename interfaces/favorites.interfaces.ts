// interfaces/favorites.interfaces.ts
export interface ProfilePicture {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export interface FavoriteResource {
  _id: string
  title: string
  program: string
  googleDriveLink: string
  uploader?: string
  createdAt: string
}

export interface FavoriteTutor {
  _id: string
  name: string
  bio: string
  subjects: string[]
  hourlyRate: number
  studentId: string
  credentials?: string
  profilePicture?: ProfilePicture // Add this line
}

export interface FavoriteItem {
  _id: string
  tutorId?: string
  resourceId?: string
  tutor?: FavoriteTutor
  resource?: FavoriteResource
  createdAt: string
}

export interface FavoritesResponse {
  favorites: FavoriteItem[]
}

export interface RemoveFavoriteRequest {
  tutorId?: string
  resourceId?: string
}
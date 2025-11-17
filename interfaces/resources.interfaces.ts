export interface Resource {
  _id: string;
  title: string;
  course: string;
  googleDriveLink: string;
  uploader?: string;
  uploaderName?: string;
  createdAt: string;
  favoriteCount?: number;
}

export interface UploadResourceData {
    title: string;
    course: string;
    file: File;
}

export interface FavoriteAction {
    resourceId: string;
    action: 'add' | 'remove';
}
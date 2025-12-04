import { Resource, UploadResourceData, FavoriteAction } from "@/interfaces/resources.interfaces";

class ResourcesService {
    private baseUrl = 'https://backend-learnbridge.onrender.com/api';

    private getToken(): string {
        if (typeof window === 'undefined') {
            throw new Error("Cannot access localStorage on server side");
        }

        const token = localStorage.getItem('token');
        if (!token){
            throw new Error("No auth token found");
        }

        return token;
    }

    private async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
        const token = this.getToken();

        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async fetchResources(): Promise<Resource[]>{
        const data = await this.fetchWithAuth<{ resources: Resource[] }>(`${this.baseUrl}/upload/getallfile`);
        return data.resources || [];
    }

    async fetchResourceById(resourceId: string): Promise<Resource> {
        const data = await this.fetchWithAuth<{ resource: Resource }>(`${this.baseUrl}/upload/getfile/${resourceId}`);
        return data.resource;
    }

    async recordResourceView(resourceId: string): Promise<Resource> {
        // This endpoint both fetches the file and records a view
        const data = await this.fetchWithAuth<{ resource: Resource }>(`${this.baseUrl}/upload/getfile/${resourceId}`);
        return data.resource;
    }

    async fetchFavorites(): Promise<string[]> {
        const data = await this.fetchWithAuth<{ favorites: any[] }>(`${this.baseUrl}/favorites/getfave`);
        
        return data.favorites
            .filter((fav: any) => fav.resourceId)
            .map((fav: any) => fav.resourceId);
    }

    async uploadResource(uploadData: UploadResourceData): Promise<Resource> {
        const token = this.getToken();

        const formData = new FormData();
        formData.append('title', uploadData.title);
        formData.append('course', uploadData.course);
        formData.append('file', uploadData.file);

        const response = await fetch(`${this.baseUrl}/upload/uploadfile`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload resource");
        }

        const data = await response.json();
        return data.resource;
    }

    async addFavorite(resourceId: string): Promise<void> {
        await this.fetchWithAuth(`${this.baseUrl}/favorites/addfave`, {
            method: 'POST',
            body: JSON.stringify({ resourceId }),
        });
    }

    async removeFavorite(resourceId: string): Promise<void> {
        await this.fetchWithAuth(`${this.baseUrl}/favorites/removefave`, {
            method: 'POST',
            body: JSON.stringify({ resourceId }),
        });
    }
}

export const resourcesService = new ResourcesService();
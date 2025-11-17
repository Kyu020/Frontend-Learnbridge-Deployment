import { Resource } from "@/interfaces/resources.interfaces"
import { UserProfile } from "@/interfaces/profile.interfaces"
import { Tutor } from "@/interfaces/tutors.interfaces"
import { DashboardData } from "@/interfaces/dashboard.interfaces";

class DashboardService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json() as Promise <T>;
    }

    async fetchResources(): Promise<Resource[]> {
        const data = await this.fetchWithAuth<{ resources: Resource []}>(`${this.baseUrl}/upload/getallfile`);
        return data.resources || [];
    }

    async fetchTutors(): Promise<Tutor[]> {
        const data = await this.fetchWithAuth<{ tutors: Tutor[]}>(`${this.baseUrl}/tutor/getalltutor`);
        return data.tutors || [];
    }  

    async fetchCurrentUser(): Promise<UserProfile | null> {
        const data = await this.fetchWithAuth<{user: UserProfile | null}>(`${this.baseUrl}/auth/me`);
        return data.user || null;
    }

    async fetchDashboardData(): Promise<DashboardData> {
        const [user, resources, tutors] = await Promise.all([
            this.fetchCurrentUser(),
            this.fetchResources(),
            this.fetchTutors()
        ]);

        return { user, resources, tutors };
    }
}

export const dashboardService = new DashboardService();
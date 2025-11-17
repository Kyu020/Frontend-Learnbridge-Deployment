// services/tutors.service.ts
import { Tutor, TutorFormData, ScheduleFormData, ProfilePicture } from '@/interfaces/tutors.interfaces';

class TutorsService {
  private baseUrl = 'http://localhost:5000/api';

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

  // Enhanced helper function to normalize profile picture data
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

  async fetchTutors(): Promise<Tutor[]> {
    try {
      const data = await this.fetchWithAuth<{ tutors: any[] }>(`${this.baseUrl}/tutor/getalltutor`);
      
      if (!data.tutors || !Array.isArray(data.tutors)) {
        console.warn('No tutors array in response');
        return [];
      }

      // Format tutors to ensure they have all required properties
      const formattedTutors = data.tutors.map((tutor: any, index: number) => {
        const normalizedTutor: Tutor = {
          _id: tutor._id || tutor.studentId || `temp-${index}`,
          studentId: tutor.studentId || tutor._id || `temp-${index}`,
          name: tutor.name || tutor.username || "Unknown Tutor",
          username: tutor.username,
          bio: tutor.bio || "No bio available",
          course: Array.isArray(tutor.course) ? tutor.course : [],
          hourlyRate: tutor.hourlyRate || 0,
          availability: Array.isArray(tutor.availability) ? tutor.availability : [],
          credentials: tutor.credentials || "",
          favoriteCount: tutor.favoriteCount || 0,
          ratingAverage: tutor.ratingAverage || 0,
          ratingCount: tutor.ratingCount || 0,
          profilePicture: this.normalizeProfilePicture(tutor.profilePicture),
          createdAt: tutor.createdAt || new Date().toISOString(),
          updatedAt: tutor.updatedAt || new Date().toISOString(),
          teachingLevel: tutor.teachingLevel || "beginner",
          teachingStyle: tutor.teachingStyle || "interactive",
          modeOfTeaching: tutor.modeOfTeaching || "online",
          program: tutor.program,
          email: tutor.email
        };

        return normalizedTutor;
      });

      return formattedTutors;

    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  }

  async fetchFavorites(): Promise<string[]> {
    const data = await this.fetchWithAuth<{ favorites: any[] }>(`${this.baseUrl}/favorites/getfave`);
    return data.favorites
      ?.filter((fav: any) => fav.tutorId)
      .map((fav: any) => fav.tutorId) || [];
  }

  async verifyTutorProfile(): Promise<{ tutorProfile: Tutor | null }> {
    const data = await this.fetchWithAuth<{ tutorProfile: any }>(`${this.baseUrl}/tutor/verifytutorprofile`);
    
    if (!data.tutorProfile) {
      return { tutorProfile: null };
    }

    // Normalize the tutor profile data to match the Tutor interface
    const normalizedTutor: Tutor = {
      _id: data.tutorProfile._id || data.tutorProfile.studentId || "",
      studentId: data.tutorProfile.studentId || data.tutorProfile._id || "",
      name: data.tutorProfile.name || data.tutorProfile.username || "Unknown Tutor",
      username: data.tutorProfile.username,
      bio: data.tutorProfile.bio || "No bio available",
      course: Array.isArray(data.tutorProfile.course) ? data.tutorProfile.course : [],
      hourlyRate: data.tutorProfile.hourlyRate || 0,
      availability: Array.isArray(data.tutorProfile.availability) ? data.tutorProfile.availability : [],
      credentials: data.tutorProfile.credentials || "",
      favoriteCount: data.tutorProfile.favoriteCount || 0,
      ratingAverage: data.tutorProfile.ratingAverage || 0,
      ratingCount: data.tutorProfile.ratingCount || 0,
      profilePicture: this.normalizeProfilePicture(data.tutorProfile.profilePicture),
      createdAt: data.tutorProfile.createdAt,
      updatedAt: data.tutorProfile.updatedAt,
      teachingLevel: data.tutorProfile.teachingLevel || "beginner",
      teachingStyle: data.tutorProfile.teachingStyle || "interactive",
      modeOfTeaching: data.tutorProfile.modeOfTeaching || "online",
      program: data.tutorProfile.program,
      email: data.tutorProfile.email
    };

    return { tutorProfile: normalizedTutor };
  }

  async toggleTutorMode(studentId: string, isTutor: boolean): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/tutor/toggletutormode/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({ isTutor }),
    });
  }

  async createTutorProfile(formData: TutorFormData): Promise<{ tutor: Tutor }> {
    // Include all the new fields in the formatted data
    const formattedData = {
      bio: formData.bio,
      course: formData.course.split(",").map((s: string) => s.trim()).filter((s: string) => s),
      availability: formData.availability.split(",").map((a: string) => a.trim()).filter((a: string) => a),
      hourlyRate: parseInt(formData.hourlyRate) || 0,
      credentials: formData.credentials,
      teachingLevel: formData.teachingLevel,
      teachingStyle: formData.teachingStyle,
      modeOfTeaching: formData.modeOfTeaching
    };

    const response = await this.fetchWithAuth<{ tutor: any }>(`${this.baseUrl}/tutor/createtutor`, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });

    // Normalize the response to match Tutor interface
    const normalizedTutor: Tutor = {
      _id: response.tutor._id || response.tutor.studentId || "",
      studentId: response.tutor.studentId || response.tutor._id || "",
      name: response.tutor.name || response.tutor.username || "Unknown Tutor",
      username: response.tutor.username,
      bio: response.tutor.bio || "No bio available",
      course: Array.isArray(response.tutor.course) ? response.tutor.course : [],
      hourlyRate: response.tutor.hourlyRate || 0,
      availability: Array.isArray(response.tutor.availability) ? response.tutor.availability : [],
      credentials: response.tutor.credentials || "",
      favoriteCount: response.tutor.favoriteCount || 0,
      ratingAverage: response.tutor.ratingAverage || 0,
      ratingCount: response.tutor.ratingCount || 0,
      profilePicture: this.normalizeProfilePicture(response.tutor.profilePicture),
      createdAt: response.tutor.createdAt,
      updatedAt: response.tutor.updatedAt,
      teachingLevel: response.tutor.teachingLevel || "beginner",
      teachingStyle: response.tutor.teachingStyle || "interactive",
      modeOfTeaching: response.tutor.modeOfTeaching || "online",
      program: response.tutor.program,
      email: response.tutor.email
    };

    return { tutor: normalizedTutor };
  }

  async updateTutorProfile(formData: TutorFormData): Promise<{ updatedProfile: Tutor }> {
    // Include all the new fields in the formatted data
    const formattedData = {
      bio: formData.bio,
      course: formData.course.split(",").map((s: string) => s.trim()).filter((s: string) => s),
      availability: formData.availability.split(",").map((a: string) => a.trim()).filter((a: string) => a),
      hourlyRate: parseInt(formData.hourlyRate) || 0,
      credentials: formData.credentials,
      teachingLevel: formData.teachingLevel,
      teachingStyle: formData.teachingStyle,
      modeOfTeaching: formData.modeOfTeaching
    };

    const response = await this.fetchWithAuth<{ updatedProfile: any }>(`${this.baseUrl}/tutor/updatetutor`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    });

    // Normalize the response to match Tutor interface
    const normalizedTutor: Tutor = {
      _id: response.updatedProfile._id || response.updatedProfile.studentId || "",
      studentId: response.updatedProfile.studentId || response.updatedProfile._id || "",
      name: response.updatedProfile.name || response.updatedProfile.username || "Unknown Tutor",
      username: response.updatedProfile.username,
      bio: response.updatedProfile.bio || "No bio available",
      course: Array.isArray(response.updatedProfile.course) ? response.updatedProfile.course : [],
      hourlyRate: response.updatedProfile.hourlyRate || 0,
      availability: Array.isArray(response.updatedProfile.availability) ? response.updatedProfile.availability : [],
      credentials: response.updatedProfile.credentials || "",
      favoriteCount: response.updatedProfile.favoriteCount || 0,
      ratingAverage: response.updatedProfile.ratingAverage || 0,
      ratingCount: response.updatedProfile.ratingCount || 0,
      profilePicture: this.normalizeProfilePicture(response.updatedProfile.profilePicture),
      createdAt: response.updatedProfile.createdAt,
      updatedAt: response.updatedProfile.updatedAt,
      teachingLevel: response.updatedProfile.teachingLevel || "beginner",
      teachingStyle: response.updatedProfile.teachingStyle || "interactive",
      modeOfTeaching: response.updatedProfile.modeOfTeaching || "online",
      program: response.updatedProfile.program,
      email: response.updatedProfile.email
    };

    return { updatedProfile: normalizedTutor };
  }

  async scheduleSession(scheduleData: ScheduleFormData & { tutorId: string }): Promise<void> {
    // Use sessionTime instead of time to match the interface
    const formattedData = {
      tutorId: scheduleData.tutorId,
      sessionDate: new Date(`${scheduleData.sessionDate}T${scheduleData.sessionTime}`).toISOString(),
      duration: parseInt(scheduleData.duration),
      price: parseFloat(scheduleData.price),
      course: scheduleData.course,
      comment: scheduleData.comment || "I would like to schedule a tutoring session",
      modality: scheduleData.modality
    };

    await this.fetchWithAuth(`${this.baseUrl}/request/sendrequest`, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async addFavorite(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/addfave`, {
      method: 'POST',
      body: JSON.stringify({ tutorId }),
    });
  }

  async removeFavorite(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/removefave`, {
      method: 'POST',
      body: JSON.stringify({ tutorId }),
    });
  }
}

export const tutorsService = new TutorsService();
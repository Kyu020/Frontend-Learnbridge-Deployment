import { Resource } from "./resources.interfaces"
import { UserProfile } from "./profile.interfaces"
import { Tutor } from "./tutors.interfaces"

export interface DashboardData {
    user : UserProfile | null;
    resources: Resource[];
    tutors: Tutor[];
}
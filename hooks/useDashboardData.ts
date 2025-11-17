import { useState, useEffect } from "react";
import { dashboardService } from "@/services/dashboard.service";
import { Resource } from "@/interfaces/resources.interfaces"
import { UserProfile } from "@/interfaces/profile.interfaces"
import { Tutor } from "@/interfaces/tutors.interfaces"
import { useToast } from "./use-toast";

interface UseDashboardDataReturn {
    user : UserProfile | null;
    resources: Resource[];
    tutors: Tutor[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useDashboardDataReturn = (): UseDashboardDataReturn => {
    const [data, setData] = useState<{ 
        user: UserProfile | null; 
        resources: Resource[]; 
        tutors: Tutor[] 
    }>({
        user: null,
        resources: [],
        tutors: [],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        try{
            setLoading(true);
            setError(null);

            const dashboardData = await dashboardService.fetchDashboardData();
            setData(dashboardData);

            toast({
                title: "Welcome back! 🎉",
                description: `Dashboard loaded successfully`,
            });
        } catch (err: any) {
        console.error("❌ Fetch error:", err);
        toast({
          title: "Error loading dashboard",
          description: err.message || "Failed to load your data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        user: data.user,
        resources: data.resources,
        tutors: data.tutors,
        loading,
        error,
        refetch: fetchData,
    }
}
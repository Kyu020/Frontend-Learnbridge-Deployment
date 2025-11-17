import { useState } from 'react';
import { resourcesService } from '@/services/resources.service';
import { UploadResourceData, Resource } from '@/interfaces/resources.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseResourceUploadReturn {
  uploadResource: (data: UploadResourceData) => Promise<Resource | null>;
  uploading: boolean;
  reset: () => void;
}

export const useResourceUpload = (): UseResourceUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadResource = async (uploadData: UploadResourceData): Promise<Resource | null> => {
    const allowedTypes = ['.pdf', '.ppt', '.pptx', '.jpeg', '.jpg', '.png', '.doc', '.docx'];
    const fileExtension = '.' + uploadData.file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension || '')) {
      toast({
        title: "Invalid file type",
        description: `Allowed types: ${allowedTypes.join(', ')}`,
        variant: "destructive"
      });
      return null;
    }

    try {
      setUploading(true);
      
      toast({
        title: "Uploading resource...",
        description: "Please wait while we process your file",
      });

      const resource = await resourcesService.uploadResource(uploadData);
      
      toast({
        title: "Success! 🎉",
        description: "Resource uploaded successfully!"
      });
      
      return resource;
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred while uploading.";
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
  };

  return {
    uploadResource,
    uploading,
    reset,
  };
};
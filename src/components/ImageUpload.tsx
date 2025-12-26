import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'covers', className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 Mo');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('story-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Erreur lors de l\'upload');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('story-images')
        .getPublicUrl(data.path);

      onChange(publicUrl);
      toast.success('Image uploadée avec succès');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={className}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Changer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Upload en cours...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm">Cliquez pour sélectionner une image</span>
              <span className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5 Mo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

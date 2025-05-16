import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ArtworkEditFormProps {
  artwork?: {
    id: string;
    title: string;
    description: string;
    medium: string;
    dimensions: string;
    year: number;
    imageUrl: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (artwork: any) => void;
}

const ArtworkEditForm = ({
  artwork = {
    id: '',
    title: '',
    description: '',
    medium: '',
    dimensions: '',
    year: new Date().getFullYear(),
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80'
  },
  open = true,
  onOpenChange = () => {},
  onSave = () => {}
}: ArtworkEditFormProps) => {
  const [formData, setFormData] = useState(artwork);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(artwork.imageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        setFormData(prev => ({ ...prev, imageUrl: url }));
      }, 1500);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.medium.trim()) {
      newErrors.medium = 'Medium is required';
    }
    
    if (!formData.dimensions.trim()) {
      newErrors.dimensions = 'Dimensions are required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (isNaN(Number(formData.year)) || Number(formData.year) < 1900 || Number(formData.year) > new Date().getFullYear()) {
      newErrors.year = 'Please enter a valid year';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>{artwork.id ? 'Edit Artwork' : 'Add New Artwork'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medium">Medium *</Label>
                <Select 
                  value={formData.medium} 
                  onValueChange={(value) => handleSelectChange('medium', value)}
                >
                  <SelectTrigger className={errors.medium ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil">Oil</SelectItem>
                    <SelectItem value="acrylic">Acrylic</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="mixed-media">Mixed Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.medium && <p className="text-red-500 text-sm">{errors.medium}</p>}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions *</Label>
                <Input 
                  id="dimensions" 
                  name="dimensions" 
                  value={formData.dimensions} 
                  onChange={handleChange}
                  placeholder="e.g. 24" × 36""
                  className={errors.dimensions ? 'border-red-500' : ''}
                />
                {errors.dimensions && <p className="text-red-500 text-sm">{errors.dimensions}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input 
                  id="year" 
                  name="year" 
                  type="number" 
                  value={formData.year} 
                  onChange={handleChange}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Artwork Image</Label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Artwork preview" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        Uploading...
                      </div>
                    )}
                  </div>
                  <div className="flex w-full gap-2">
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsImageModalOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <Upload size={16} />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the errors above before submitting.
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Artwork</Button>
          </DialogFooter>
          
          <ImageUploadModal 
            open={isImageModalOpen}
            onOpenChange={setIsImageModalOpen}
            onImageSelected={handleImageSelected}
            currentImageUrl={formData.imageUrl}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkEditForm;

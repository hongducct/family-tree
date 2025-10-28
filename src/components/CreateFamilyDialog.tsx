import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { createFamily } from '../data/mockData';
import { toast } from 'sonner';

interface CreateFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess: (familyId: string) => void;
}

export function CreateFamilyDialog({ 
  open, 
  onOpenChange, 
  userId, 
  onSuccess 
}: CreateFamilyDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên gia phả');
      return;
    }

    setIsLoading(true);

    try {
      const newFamily = createFamily(
        formData.name.trim(),
        formData.description.trim(),
        userId
      );

      toast.success('Tạo gia phả thành công!');
      
      // Reset form
      setFormData({ name: '', description: '' });
      onOpenChange(false);
      onSuccess(newFamily.id);
      
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo gia phả');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo gia phả mới</DialogTitle>
          <DialogDescription>
            Tạo một gia phả mới cho dòng họ của bạn. Bạn sẽ trở thành admin của gia phả này.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familyName">Tên gia phả *</Label>
            <Input
              id="familyName"
              placeholder="VD: Gia đình Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="familyDescription">Mô tả (tùy chọn)</Label>
            <Textarea
              id="familyDescription"
              placeholder="VD: Dòng họ Nguyễn tại Hà Nội, bắt nguồn từ..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo gia phả'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
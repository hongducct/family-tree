import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Family, User } from '../types/family';
import { mockFamilies, getUserFamilies, getUserRoleInFamily } from '../data/mockData';
import { generateFamilyUrl, getFamilyStats } from '../utils/familyUtils';
import { toast } from 'sonner';
import { Settings, Users, Globe, Lock, Copy, ExternalLink } from 'lucide-react';

interface FamilySettingsProps {
  family: Family;
  currentUser: User;
  onClose: () => void;
}

export function FamilySettings({ family, currentUser, onClose }: FamilySettingsProps) {
  const [formData, setFormData] = useState({
    name: family.name,
    description: family.description || '',
    isPublic: family.isPublic,
    allowPublicView: family.settings.allowPublicView,
    allowMemberInvite: family.settings.allowMemberInvite,
    requireApproval: family.settings.requireApproval
  });
  const [isLoading, setIsLoading] = useState(false);

  const userRole = getUserRoleInFamily(currentUser.id, family.id);
  const canEdit = userRole === 'admin';
  const stats = getFamilyStats(family.id);
  const publicUrl = generateFamilyUrl(family);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast.error('Bạn không có quyền chỉnh sửa cài đặt');
      return;
    }

    setIsLoading(true);

    try {
      // Update family data
      const familyIndex = mockFamilies.findIndex(f => f.id === family.id);
      if (familyIndex !== -1) {
        mockFamilies[familyIndex] = {
          ...mockFamilies[familyIndex],
          name: formData.name.trim(),
          description: formData.description.trim(),
          isPublic: formData.isPublic,
          publicUrl: formData.isPublic ? publicUrl : undefined,
          settings: {
            allowPublicView: formData.allowPublicView,
            allowMemberInvite: formData.allowMemberInvite,
            requireApproval: formData.requireApproval
          }
        };
        
        toast.success('Cập nhật cài đặt thành công');
        onClose();
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyPublicUrl = () => {
    const fullUrl = `${window.location.origin}/public/${publicUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Đã sao chép link');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Cài đặt gia phả</h1>
            <p className="text-gray-600">{family.name}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thống kê gia phả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalMembers}</div>
              <div className="text-sm text-gray-600">Tổng thành viên</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.generations}</div>
              <div className="text-sm text-gray-600">Số thế hệ</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.livingCount}</div>
              <div className="text-sm text-gray-600">Còn sống</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.deceasedCount}</div>
              <div className="text-sm text-gray-600">Đã mất</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>
            {canEdit ? 'Cập nhật thông tin và cài đặt gia phả' : 'Bạn chỉ có thể xem thông tin'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="familyName">Tên gia phả</Label>
                <Input
                  id="familyName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Quyền của bạn</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={userRole === 'admin' ? 'destructive' : 'secondary'}>
                    {userRole === 'admin' ? 'Admin' : userRole === 'editor' ? 'Editor' : userRole === 'member' ? 'Member' : 'Viewer'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyDescription">Mô tả</Label>
              <Textarea
                id="familyDescription"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!canEdit}
                rows={3}
              />
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cài đặt quyền riêng tư</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {formData.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      <Label>Công khai gia phả</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Cho phép mọi người xem gia phả mà không cần đăng nhập
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    disabled={!canEdit}
                  />
                </div>

                {formData.isPublic && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Label className="text-sm font-medium">Link công khai:</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={`${window.location.origin}/public/${publicUrl}`}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyPublicUrl}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/public/${publicUrl}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Cho phép thành viên mời người khác</Label>
                    <p className="text-sm text-gray-600">
                      Thành viên có thể gửi lời mời tham gia gia phả
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowMemberInvite}
                    onCheckedChange={(checked) => handleInputChange('allowMemberInvite', checked)}
                    disabled={!canEdit}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Yêu cầu phê duyệt</Label>
                    <p className="text-sm text-gray-600">
                      Tất cả thay đổi cần admin phê duyệt trước khi áp dụng
                    </p>
                  </div>
                  <Switch
                    checked={formData.requireApproval}
                    onCheckedChange={(checked) => handleInputChange('requireApproval', checked)}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
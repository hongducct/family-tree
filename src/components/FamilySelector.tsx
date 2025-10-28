import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CreateFamilyDialog } from './CreateFamilyDialog';
import { Family, User } from '../types/family';
import { getUserFamilies, getUserRoleInFamily } from '../data/mockData';
import { Users, Plus, Crown, Edit2, User as UserIcon, Eye } from 'lucide-react';

interface FamilySelectorProps {
  user: User;
  onSelectFamily: (familyId: string) => void;
}

export function FamilySelector({ user, onSelectFamily }: FamilySelectorProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const userFamilies = getUserFamilies(user.id);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'editor':
        return <Edit2 className="h-3 w-3" />;
      case 'member':
        return <UserIcon className="h-3 w-3" />;
      case 'viewer':
        return <Eye className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="gap-1">{getRoleIcon(role)} Admin</Badge>;
      case 'editor':
        return <Badge variant="default" className="gap-1">{getRoleIcon(role)} Editor</Badge>;
      case 'member':
        return <Badge variant="secondary" className="gap-1">{getRoleIcon(role)} Member</Badge>;
      case 'viewer':
        return <Badge variant="outline" className="gap-1">{getRoleIcon(role)} Viewer</Badge>;
      default:
        return null;
    }
  };

  const handleCreateFamily = () => {
    setShowCreateDialog(false);
    // Refresh will happen when family is created and user is redirected
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Chào mừng, {user.name}!</h1>
          <p className="text-gray-600">Chọn gia phả để xem hoặc tạo gia phả mới</p>
        </div>

        {userFamilies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Các gia phả của bạn
              </CardTitle>
              <CardDescription>
                Chọn một gia phả để xem và quản lý
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userFamilies.map((family) => {
                const userRole = getUserRoleInFamily(user.id, family.id);
                return (
                  <div
                    key={family.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectFamily(family.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{family.name}</h3>
                        {userRole && getRoleBadge(userRole)}
                      </div>
                      {family.description && (
                        <p className="text-sm text-gray-600">{family.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Tạo ngày: {new Date(family.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Xem gia phả
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tạo gia phả mới
            </CardTitle>
            <CardDescription>
              Bắt đầu xây dựng cây gia phả cho dòng họ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowCreateDialog(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Tạo gia phả mới
            </Button>
          </CardContent>
        </Card>

        {userFamilies.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Chưa có gia phả nào
              </h3>
              <p className="text-blue-700 mb-4">
                Hãy tạo gia phả đầu tiên của bạn để bắt đầu ghi chép lịch sử gia đình
              </p>
            </div>
          </div>
        )}
      </div>

      <CreateFamilyDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        userId={user.id}
        onSuccess={handleCreateFamily}
      />
    </div>
  );
}
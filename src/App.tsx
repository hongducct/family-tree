import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { FamilyTreeView } from './components/FamilyTreeView';
import { ProfileCard } from './components/ProfileCard';
import { SearchBar } from './components/SearchBar';
import { MemberFormDialog } from './components/MemberFormDialog';
import { PendingChangesDialog } from './components/PendingChangesDialog';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { 
  mockFamilyMembers, 
  setCurrentUser, 
  getCurrentUser, 
  getFamilyMemberById,
  getUserById,
  addPendingChange,
  approvePendingChange,
  rejectPendingChange,
  getPendingChanges
} from './data/mockData';
import { FamilyMember, User as UserType } from './types/family';
import { LogOut, Users, User, Home, Plus, Bell, Shield, Edit2, Eye } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState<UserType | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>(undefined);
  const [showPendingChanges, setShowPendingChanges] = useState(false);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const [deleteConfirmMemberId, setDeleteConfirmMemberId] = useState<string | null>(null);
  const [addChildParentId, setAddChildParentId] = useState<string | undefined>(undefined);
  const [addSpouseForId, setAddSpouseForId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isLoggedIn) {
      setPendingChangesCount(getPendingChanges().length);
    }
  }, [isLoggedIn, showPendingChanges]);

  const handleLogin = (userId: string) => {
    const user = getUserById(userId);
    if (!user) return;

    setIsLoggedIn(true);
    setCurrentUser(user);
    setCurrentUserState(user);
    setSelectedMemberId(user.familyMemberId);
    setActiveTab('profile');
    toast.success(`Chào mừng ${user.name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserState(null);
    setSelectedMemberId(null);
    setActiveTab('home');
    toast.info('Đã đăng xuất');
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('profile');
  };

  const handleAddMember = () => {
    if (!currentUser) return;

    if (currentUser.role === 'viewer') {
      toast.error('Bạn không có quyền thêm thành viên');
      return;
    }

    setEditingMember(undefined);
    setAddChildParentId(undefined);
    setAddSpouseForId(undefined);
    setShowMemberForm(true);
  };

  const handleAddChild = (parentId: string) => {
    if (!currentUser) return;

    if (currentUser.role === 'viewer') {
      toast.error('Bạn không có quyền thêm thành viên');
      return;
    }

    setEditingMember(undefined);
    setAddChildParentId(parentId);
    setAddSpouseForId(undefined);
    setShowMemberForm(true);
  };

  const handleAddSpouse = (memberId: string) => {
    if (!currentUser) return;

    if (currentUser.role === 'viewer') {
      toast.error('Bạn không có quyền thêm thành viên');
      return;
    }

    setEditingMember(undefined);
    setAddChildParentId(undefined);
    setAddSpouseForId(memberId);
    setShowMemberForm(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    if (!currentUser) return;

    const canEdit = currentUser.role === 'admin' || 
                    currentUser.role === 'editor' || 
                    (currentUser.role === 'member' && currentUser.familyMemberId === member.id);

    if (!canEdit) {
      toast.error('Bạn không có quyền chỉnh sửa thành viên này');
      return;
    }

    setEditingMember(member);
    setAddChildParentId(undefined);
    setAddSpouseForId(undefined);
    setShowMemberForm(true);
  };

  const handleDeleteMember = (memberId: string) => {
    if (!currentUser) return;

    if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
      toast.error('Bạn không có quyền xóa thành viên');
      return;
    }

    setDeleteConfirmMemberId(memberId);
  };

  const confirmDelete = () => {
    if (!currentUser || !deleteConfirmMemberId) return;

    const member = getFamilyMemberById(deleteConfirmMemberId);
    if (!member) return;

    if (currentUser.role === 'admin') {
      // Admin can delete directly
      const index = mockFamilyMembers.findIndex(m => m.id === deleteConfirmMemberId);
      if (index !== -1) {
        mockFamilyMembers.splice(index, 1);
        toast.success('Đã xóa thành viên');
        if (selectedMemberId === deleteConfirmMemberId) {
          setSelectedMemberId(currentUser.familyMemberId);
        }
      }
    } else {
      // Editor needs approval
      addPendingChange({
        type: 'delete',
        submittedBy: currentUser.id,
        data: member,
        originalData: member
      });
      toast.success('Yêu cầu xóa đã được gửi, chờ admin phê duyệt');
      setPendingChangesCount(getPendingChanges().length);
    }

    setDeleteConfirmMemberId(null);
  };

  const handleSubmitMember = (data: Partial<FamilyMember>) => {
    if (!currentUser) return;

    const isEditing = !!editingMember;
    const changeType = isEditing ? 'edit' : 'add';

    // Xử lý quan hệ cha mẹ - con
    if (!isEditing) {
      // Thêm con vào danh sách con của cha
      if (data.fatherId) {
        const father = getFamilyMemberById(data.fatherId);
        if (father) {
          const updatedFather = {
            ...father,
            childrenIds: [...(father.childrenIds || []), data.id!]
          };
          const fatherIndex = mockFamilyMembers.findIndex(m => m.id === data.fatherId);
          if (fatherIndex !== -1) {
            mockFamilyMembers[fatherIndex] = updatedFather;
          }
        }
      }

      // Thêm con vào danh sách con của mẹ
      if (data.motherId) {
        const mother = getFamilyMemberById(data.motherId);
        if (mother) {
          const updatedMother = {
            ...mother,
            childrenIds: [...(mother.childrenIds || []), data.id!]
          };
          const motherIndex = mockFamilyMembers.findIndex(m => m.id === data.motherId);
          if (motherIndex !== -1) {
            mockFamilyMembers[motherIndex] = updatedMother;
          }
        }
      }

      // Xử lý quan hệ vợ chồng
      if (data.spouseIds && data.spouseIds.length > 0) {
        data.spouseIds.forEach(spouseId => {
          const spouse = getFamilyMemberById(spouseId);
          if (spouse) {
            const updatedSpouse = {
              ...spouse,
              spouseIds: [...(spouse.spouseIds || []), data.id!]
            };
            const spouseIndex = mockFamilyMembers.findIndex(m => m.id === spouseId);
            if (spouseIndex !== -1) {
              mockFamilyMembers[spouseIndex] = updatedSpouse;
            }
          }
        });
      }
    }

    if (currentUser.role === 'admin') {
      // Admin can make changes directly
      if (isEditing && data.id) {
        const index = mockFamilyMembers.findIndex(m => m.id === data.id);
        if (index !== -1) {
          mockFamilyMembers[index] = { ...mockFamilyMembers[index], ...data };
          toast.success('Đã cập nhật thông tin thành viên');
        }
      } else {
        mockFamilyMembers.push(data as FamilyMember);
        toast.success('Đã thêm thành viên mới');
      }
      // Reset states
      setAddChildParentId(undefined);
      setAddSpouseForId(undefined);
    } else if (currentUser.role === 'editor' || 
               (currentUser.role === 'member' && currentUser.familyMemberId === data.id)) {
      // Editor or Member editing their own profile - needs approval
      addPendingChange({
        type: changeType,
        submittedBy: currentUser.id,
        data,
        originalData: isEditing ? editingMember : undefined
      });
      toast.success('Yêu cầu đã được gửi, chờ admin phê duyệt');
      setPendingChangesCount(getPendingChanges().length);
      // Reset states
      setAddChildParentId(undefined);
      setAddSpouseForId(undefined);
    }
  };

  const handleApproveChange = (changeId: string) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Chỉ admin mới có thể phê duyệt');
      return;
    }

    const success = approvePendingChange(changeId, currentUser.id);
    if (success) {
      toast.success('Đã phê duyệt thay đổi');
      setPendingChangesCount(getPendingChanges().length);
    } else {
      toast.error('Không thể phê duyệt');
    }
  };

  const handleRejectChange = (changeId: string, reason: string) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Chỉ admin mới có thể từ chối');
      return;
    }

    const success = rejectPendingChange(changeId, currentUser.id, reason);
    if (success) {
      toast.success('Đã từ chối thay đổi');
      setPendingChangesCount(getPendingChanges().length);
    } else {
      toast.error('Không thể từ chối');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="gap-1"><Shield className="h-3 w-3" /> Admin</Badge>;
      case 'editor':
        return <Badge variant="default" className="gap-1"><Edit2 className="h-3 w-3" /> Editor</Badge>;
      case 'member':
        return <Badge variant="secondary" className="gap-1"><User className="h-3 w-3" /> Member</Badge>;
      case 'viewer':
        return <Badge variant="outline" className="gap-1"><Eye className="h-3 w-3" /> Viewer</Badge>;
      default:
        return null;
    }
  };

  const selectedMember = selectedMemberId ? getFamilyMemberById(selectedMemberId) : null;
  const currentMember = currentUser ? getFamilyMemberById(currentUser.familyMemberId) : null;

  if (!isLoggedIn || !currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const canAddEdit = currentUser.role === 'admin' || currentUser.role === 'editor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-blue-900">Gia Phả Việt</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Xin chào, {currentMember?.fullName}
                  </p>
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPendingChanges(true)}
                  className="relative"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Chờ duyệt
                  {pendingChangesCount > 0 && (
                    <Badge className="ml-2 bg-red-500">
                      {pendingChangesCount}
                    </Badge>
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <TabsList>
              <TabsTrigger value="home" className="gap-2">
                <Home className="h-4 w-4" />
                Trang chủ
              </TabsTrigger>
              <TabsTrigger value="tree" className="gap-2">
                <Users className="h-4 w-4" />
                Cây gia phả
              </TabsTrigger>
              {selectedMember && (
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Hồ sơ
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <SearchBar
                members={mockFamilyMembers}
                onSelectMember={handleSelectMember}
                currentUserId={currentUser.familyMemberId}
              />
              {canAddEdit && (
                <Button onClick={handleAddMember} className="gap-2 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Thêm
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="home" className="space-y-6">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="mb-4">Chào mừng đến với Gia Phả Việt</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="mb-2">
                  <strong>Quyền của bạn ({currentUser.role}):</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {currentUser.role === 'admin' && (
                    <>
                      <li>✓ Xem, thêm, sửa, xóa tất cả thành viên</li>
                      <li>✓ Phê duyệt yêu cầu thay đổi từ Editor và Member</li>
                    </>
                  )}
                  {currentUser.role === 'editor' && (
                    <>
                      <li>✓ Xem tất cả thành viên</li>
                      <li>✓ Thêm, sửa, xóa thành viên (cần admin duyệt)</li>
                    </>
                  )}
                  {currentUser.role === 'member' && (
                    <>
                      <li>✓ Xem tất cả thành viên</li>
                      <li>✓ Chỉnh sửa thông tin cá nhân (cần admin duyệt)</li>
                    </>
                  )}
                  {currentUser.role === 'viewer' && (
                    <li>✓ Chỉ xem thông tin gia phả</li>
                  )}
                </ul>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2">Tổng số thành viên</h3>
                  <p className="text-blue-600">{mockFamilyMembers.length} người</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2">Số thế hệ</h3>
                  <p className="text-green-600">4 thế hệ</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2">Vị trí của bạn</h3>
                  <p className="text-purple-600">Thế hệ {currentMember?.generation}</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="mb-2">💡 Mẹo sử dụng</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Sử dụng thanh tìm kiếm để nhanh chóng tìm người thân</li>
                  <li>• Xem cây gia phả để hiểu rõ cấu trúc gia đình</li>
                  <li>• Nhấp vào bất kỳ thành viên nào để xem hồ sơ chi tiết</li>
                  {canAddEdit && <li>• Bấm nút "Thêm" để thêm thành viên mới vào gia phả</li>}
                  {currentUser.role === 'admin' && (
                    <li>• Kiểm tra thông báo để duyệt yêu cầu từ Editor và Member</li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tree" className="mt-0 h-[calc(100vh-180px)]">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                <h2>Cây gia phả</h2>
                <p className="text-sm text-gray-600 mt-1">
                  💡 Nhấp vào thành viên để xem chi tiết • Cuộn chuột để zoom • Kéo để di chuyển • Click đúp để reset zoom
                </p>
              </div>
              <div className="flex-1 overflow-hidden">
                <FamilyTreeView
                  members={mockFamilyMembers}
                  onSelectMember={handleSelectMember}
                  selectedMemberId={selectedMemberId || undefined}
                  onAddChild={handleAddChild}
                  onAddSpouse={handleAddSpouse}
                  canEdit={canAddEdit}
                />
              </div>
            </div>
          </TabsContent>

          {selectedMember && (
            <TabsContent value="profile" className="flex justify-center">
              <ProfileCard 
                member={selectedMember} 
                currentUserId={currentUser.familyMemberId}
                currentUser={currentUser}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
                onAddChild={handleAddChild}
                onAddSpouse={handleAddSpouse}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Dialogs */}
      <MemberFormDialog
        open={showMemberForm}
        onOpenChange={setShowMemberForm}
        member={editingMember}
        onSubmit={handleSubmitMember}
        isEditing={!!editingMember}
        parentId={addChildParentId}
        spouseId={addSpouseForId}
        relationType={addChildParentId ? 'child' : addSpouseForId ? 'spouse' : undefined}
      />

      {currentUser.role === 'admin' && (
        <PendingChangesDialog
          open={showPendingChanges}
          onOpenChange={setShowPendingChanges}
          changes={getPendingChanges()}
          onApprove={handleApproveChange}
          onReject={handleRejectChange}
        />
      )}

      <AlertDialog open={!!deleteConfirmMemberId} onOpenChange={(open) => !open && setDeleteConfirmMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>
              {currentUser.role === 'admin' 
                ? 'Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.'
                : 'Yêu cầu xóa sẽ được gửi đến admin để phê duyệt.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {currentUser.role === 'admin' ? 'Xóa' : 'Gửi yêu cầu'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

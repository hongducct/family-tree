import { useState, useEffect } from 'react';
import { AuthTabs } from './components/AuthTabs';
import { FamilySelector } from './components/FamilySelector';
import { FamilyTreeView } from './components/FamilyTreeView';
import { ProfileCard } from './components/ProfileCard';
import { SearchBar } from './components/SearchBar';
import { MemberFormDialog } from './components/MemberFormDialog';
import { PendingChangesDialog } from './components/PendingChangesDialog';
import { FamilySettings } from './components/FamilySettings';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { 
  setCurrentUser, 
  getCurrentUser, 
  getFamilyMemberById,
  getUserById,
  addPendingChange,
  approvePendingChange,
  rejectPendingChange,
  getPendingChanges,
  getFamilyMembers,
  getFamilyById
} from './data/mockData';
import { FamilyMember, User as UserType, Family } from './types/family';
import { LogOut, Users, User, Home, Plus, Bell, Shield, Edit2, Eye, Settings, ArrowLeft } from 'lucide-react';
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
import { 
  canUserAccessFamily, 
  canUserEditInFamily, 
  getUserCurrentFamily,
  switchUserFamily 
} from './utils/familyUtils';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState<UserType | null>(null);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>(undefined);
  const [showPendingChanges, setShowPendingChanges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const [deleteConfirmMemberId, setDeleteConfirmMemberId] = useState<string | null>(null);
  const [addChildParentId, setAddChildParentId] = useState<string | undefined>(undefined);
  const [addSpouseForId, setAddSpouseForId] = useState<string | undefined>(undefined);

  // Get current family members
  const familyMembers = currentFamily ? getFamilyMembers(currentFamily.id) : [];

  useEffect(() => {
    if (isLoggedIn && currentFamily) {
      setPendingChangesCount(getPendingChanges(currentFamily.id).length);
    }
  }, [isLoggedIn, currentFamily, showPendingChanges]);

  const handleLogin = (userId: string) => {
    const user = getUserById(userId);
    if (!user) return;

    setIsLoggedIn(true);
    setCurrentUser(user);
    setCurrentUserState(user);
    
    // If user has a current family, set it
    if (user.currentFamilyId) {
      const family = getFamilyById(user.currentFamilyId);
      if (family && canUserAccessFamily(user.id, family.id)) {
        setCurrentFamily(family);
        // Find user's family member profile
        const membership = user.familyMemberships.find(m => m.familyId === family.id);
        if (membership?.familyMemberId) {
          setSelectedMemberId(membership.familyMemberId);
          setActiveTab('profile');
        }
      }
    }
    
    toast.success(`Chào mừng ${user.name}!`);
  };

  const handleRegister = (user: UserType) => {
    setCurrentUserState(user);
    setIsLoggedIn(true);
    toast.success(`Chào mừng ${user.name}! Hãy tạo gia phả đầu tiên của bạn.`);
  };

  const handleSelectFamily = (familyId: string) => {
    if (!currentUser) return;
    
    const family = getFamilyById(familyId);
    if (!family) return;
    
    if (!canUserAccessFamily(currentUser.id, familyId)) {
      toast.error('Bạn không có quyền truy cập gia phả này');
      return;
    }
    
    // Switch to family
    if (switchUserFamily(currentUser, familyId)) {
      setCurrentFamily(family);
      
      // Find user's family member profile
      const membership = currentUser.familyMemberships.find(m => m.familyId === familyId);
      if (membership?.familyMemberId) {
        setSelectedMemberId(membership.familyMemberId);
        setActiveTab('profile');
      } else {
        setActiveTab('home');
      }
      
      toast.success(`Đã chuyển sang gia phả: ${family.name}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserState(null);
    setCurrentFamily(null);
    setSelectedMemberId(null);
    setActiveTab('home');
    setShowSettings(false);
    toast.info('Đã đăng xuất');
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('profile');
  };

  const handleAddMember = () => {
    if (!currentUser || !currentFamily) return;

    if (!canUserEditInFamily(currentUser.id, currentFamily.id)) {
      toast.error('Bạn không có quyền thêm thành viên');
      return;
    }

    setEditingMember(undefined);
    setAddChildParentId(undefined);
    setAddSpouseForId(undefined);
    setShowMemberForm(true);
  };

  const handleAddChild = (parentId: string) => {
    if (!currentUser || !currentFamily) return;

    if (!canUserEditInFamily(currentUser.id, currentFamily.id)) {
      toast.error('Bạn không có quyền thêm thành viên');
      return;
    }

    setEditingMember(undefined);
    setAddChildParentId(parentId);
    setAddSpouseForId(undefined);
    setShowMemberForm(true);
  };

  const handleAddSpouse = (memberId: string) => {
    if (!currentUser || !currentFamily) return;

    if (!canUserEditInFamily(currentUser.id, currentFamily.id)) {
      toast.error('Bạn không có quyền thêm thành viên');
      return;
    }

    setEditingMember(undefined);
    setAddChildParentId(undefined);
    setAddSpouseForId(memberId);
    setShowMemberForm(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    if (!currentUser || !currentFamily) return;

    const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;
    const canEdit = userRole === 'admin' || 
                    userRole === 'editor' || 
                    (userRole === 'member' && currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.familyMemberId === member.id);

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
    if (!currentUser || !currentFamily) return;

    const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;
    if (userRole !== 'admin' && userRole !== 'editor') {
      toast.error('Bạn không có quyền xóa thành viên');
      return;
    }

    setDeleteConfirmMemberId(memberId);
  };

  const confirmDelete = () => {
    if (!currentUser || !currentFamily || !deleteConfirmMemberId) return;

    const member = getFamilyMemberById(deleteConfirmMemberId);
    if (!member) return;

    const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;

    if (userRole === 'admin') {
      // Admin can delete directly
      const index = familyMembers.findIndex(m => m.id === deleteConfirmMemberId);
      if (index !== -1) {
        familyMembers.splice(index, 1);
        toast.success('Đã xóa thành viên');
        if (selectedMemberId === deleteConfirmMemberId) {
          const userMembership = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id);
          if (userMembership?.familyMemberId) {
            setSelectedMemberId(userMembership.familyMemberId);
          }
        }
      }
    } else {
      // Editor needs approval
      addPendingChange({
        type: 'delete',
        submittedBy: currentUser.id,
        data: member,
        originalData: member,
        familyId: currentFamily.id
      });
      toast.success('Yêu cầu xóa đã được gửi, chờ admin phê duyệt');
      setPendingChangesCount(getPendingChanges(currentFamily.id).length);
    }

    setDeleteConfirmMemberId(null);
  };

  const handleSubmitMember = (data: Partial<FamilyMember>) => {
    if (!currentUser || !currentFamily) return;

    const isEditing = !!editingMember;
    const changeType = isEditing ? 'edit' : 'add';
    const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;

    // Add familyId to data
    const memberData = { ...data, familyId: currentFamily.id };

    // Handle parent-child relationships
    if (!isEditing) {
      // Add child to father's children list
      if (memberData.fatherId) {
        const father = getFamilyMemberById(memberData.fatherId);
        if (father) {
          const updatedFather = {
            ...father,
            childrenIds: [...(father.childrenIds || []), memberData.id!]
          };
          const fatherIndex = familyMembers.findIndex(m => m.id === memberData.fatherId);
          if (fatherIndex !== -1) {
            familyMembers[fatherIndex] = updatedFather;
          }
        }
      }

      // Add child to mother's children list
      if (memberData.motherId) {
        const mother = getFamilyMemberById(memberData.motherId);
        if (mother) {
          const updatedMother = {
            ...mother,
            childrenIds: [...(mother.childrenIds || []), memberData.id!]
          };
          const motherIndex = familyMembers.findIndex(m => m.id === memberData.motherId);
          if (motherIndex !== -1) {
            familyMembers[motherIndex] = updatedMother;
          }
        }
      }

      // Handle spouse relationships
      if (memberData.spouseIds && memberData.spouseIds.length > 0) {
        memberData.spouseIds.forEach(spouseId => {
          const spouse = getFamilyMemberById(spouseId);
          if (spouse) {
            const updatedSpouse = {
              ...spouse,
              spouseIds: [...(spouse.spouseIds || []), memberData.id!]
            };
            const spouseIndex = familyMembers.findIndex(m => m.id === spouseId);
            if (spouseIndex !== -1) {
              familyMembers[spouseIndex] = updatedSpouse;
            }
          }
        });
      }
    }

    if (userRole === 'admin') {
      // Admin can make changes directly
      if (isEditing && memberData.id) {
        const index = familyMembers.findIndex(m => m.id === memberData.id);
        if (index !== -1) {
          familyMembers[index] = { ...familyMembers[index], ...memberData };
          toast.success('Đã cập nhật thông tin thành viên');
        }
      } else {
        familyMembers.push(memberData as FamilyMember);
        toast.success('Đã thêm thành viên mới');
      }
      // Reset states
      setAddChildParentId(undefined);
      setAddSpouseForId(undefined);
    } else if (userRole === 'editor' || 
               (userRole === 'member' && currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.familyMemberId === memberData.id)) {
      // Editor or Member editing their own profile - needs approval
      addPendingChange({
        type: changeType,
        submittedBy: currentUser.id,
        data: memberData,
        originalData: isEditing ? editingMember : undefined,
        familyId: currentFamily.id
      });
      toast.success('Yêu cầu đã được gửi, chờ admin phê duyệt');
      setPendingChangesCount(getPendingChanges(currentFamily.id).length);
      // Reset states
      setAddChildParentId(undefined);
      setAddSpouseForId(undefined);
    }
  };

  const handleApproveChange = (changeId: string) => {
    if (!currentUser || !currentFamily) return;
    
    const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;
    if (userRole !== 'admin') {
      toast.error('Chỉ admin mới có thể phê duyệt');
      return;
    }

    const success = approvePendingChange(changeId, currentUser.id);
    if (success) {
      toast.success('Đã phê duyệt thay đổi');
      setPendingChangesCount(getPendingChanges(currentFamily.id).length);
    } else {
      toast.error('Không thể phê duyệt');
    }
  };

  const handleRejectChange = (changeId: string, reason: string) => {
    if (!currentUser || !currentFamily) return;
    
    const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;
    if (userRole !== 'admin') {
      toast.error('Chỉ admin mới có thể từ chối');
      return;
    }

    const success = rejectPendingChange(changeId, currentUser.id, reason);
    if (success) {
      toast.success('Đã từ chối thay đổi');
      setPendingChangesCount(getPendingChanges(currentFamily.id).length);
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
  const currentMember = currentUser && currentFamily ? 
    (() => {
      const membership = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id);
      return membership?.familyMemberId ? getFamilyMemberById(membership.familyMemberId) : null;
    })() : null;

  // Show auth if not logged in
  if (!isLoggedIn || !currentUser) {
    return <AuthTabs onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Show family selector if no current family
  if (!currentFamily) {
    return <FamilySelector user={currentUser} onSelectFamily={handleSelectFamily} />;
  }

  // Show settings if requested
  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <FamilySettings 
          family={currentFamily} 
          currentUser={currentUser} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    );
  }

  const userRole = currentUser.familyMemberships.find(m => m.familyId === currentFamily.id)?.role;
  const canAddEdit = canUserEditInFamily(currentUser.id, currentFamily.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
            <div className="flex items-center gap-2 md:gap-3">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div>
                <h1 className="text-base md:text-lg lg:text-xl text-blue-900">{currentFamily.name}</h1>
                <div className="flex flex-wrap items-center gap-1 md:gap-2">
                  <p className="text-xs md:text-sm text-gray-600">
                    Xin chào, {currentMember?.fullName || currentUser.name}
                  </p>
                  {userRole && getRoleBadge(userRole)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 md:gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setCurrentFamily(null)}
                size="sm"
                className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3"
              >
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Chọn gia phả khác</span>
                <span className="sm:hidden">Gia phả</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(true)}
                size="sm"
                className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3"
              >
                <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Cài đặt</span>
              </Button>
              
              {userRole === 'admin' && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPendingChanges(true)}
                  className="relative text-xs md:text-sm h-8 md:h-9 px-2 md:px-3"
                  size="sm"
                >
                  <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Chờ duyệt</span>
                  {pendingChangesCount > 0 && (
                    <Badge className="ml-1 md:ml-2 bg-red-500 text-xs">
                      {pendingChangesCount}
                    </Badge>
                  )}
                </Button>
              )}
              
              <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
                <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Đăng xuất</span>
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
                members={familyMembers}
                onSelectMember={handleSelectMember}
                currentUserId={currentMember?.id}
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
              <h2 className="mb-4">Chào mừng đến với {currentFamily.name}</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="mb-2">
                  <strong>Quyền của bạn ({userRole}):</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {userRole === 'admin' && (
                    <>
                      <li>✓ Xem, thêm, sửa, xóa tất cả thành viên</li>
                      <li>✓ Phê duyệt yêu cầu thay đổi từ Editor và Member</li>
                      <li>✓ Quản lý cài đặt gia phả</li>
                    </>
                  )}
                  {userRole === 'editor' && (
                    <>
                      <li>✓ Xem tất cả thành viên</li>
                      <li>✓ Thêm, sửa, xóa thành viên (cần admin duyệt)</li>
                    </>
                  )}
                  {userRole === 'member' && (
                    <>
                      <li>✓ Xem tất cả thành viên</li>
                      <li>✓ Chỉnh sửa thông tin cá nhân (cần admin duyệt)</li>
                    </>
                  )}
                  {userRole === 'viewer' && (
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
                  <p className="text-blue-600">{familyMembers.length} người</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2">Số thế hệ</h3>
                  <p className="text-green-600">{new Set(familyMembers.map(m => m.generation)).size} thế hệ</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2">Vị trí của bạn</h3>
                  <p className="text-purple-600">Thế hệ {currentMember?.generation || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="mb-2">💡 Mẹo sử dụng</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Sử dụng thanh tìm kiếm để nhanh chóng tìm người thân</li>
                  <li>• Xem cây gia phả để hiểu rõ cấu trúc gia đình</li>
                  <li>• Nhấp vào bất kỳ thành viên nào để xem hồ sơ chi tiết</li>
                  {canAddEdit && <li>• Bấm nút "Thêm" để thêm thành viên mới vào gia phả</li>}
                  {userRole === 'admin' && (
                    <>
                      <li>• Kiểm tra thông báo để duyệt yêu cầu từ Editor và Member</li>
                      <li>• Vào "Cài đặt" để quản lý quyền riêng tư và công khai gia phả</li>
                    </>
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
                  members={familyMembers}
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
                currentUserId={currentMember?.id}
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

      {userRole === 'admin' && (
        <PendingChangesDialog
          open={showPendingChanges}
          onOpenChange={setShowPendingChanges}
          changes={getPendingChanges(currentFamily.id)}
          onApprove={handleApproveChange}
          onReject={handleRejectChange}
        />
      )}

      <AlertDialog open={!!deleteConfirmMemberId} onOpenChange={(open) => !open && setDeleteConfirmMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>
              {userRole === 'admin' 
                ? 'Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.'
                : 'Yêu cầu xóa sẽ được gửi đến admin để phê duyệt.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {userRole === 'admin' ? 'Xóa' : 'Gửi yêu cầu'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
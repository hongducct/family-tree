import { FamilyMember, User as UserType } from '../types/family';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Calendar, MapPin, Briefcase, Mail, Phone, Heart, User, Users, Edit, Trash, UserPlus, Heart as HeartIcon, Eye, EyeOff } from 'lucide-react';
import { RelationshipViewer } from './RelationshipViewer';
import { getFamilyMemberById, getRelationship } from '../data/mockData';
import { useState } from 'react';

interface ProfileCardProps {
  member: FamilyMember;
  currentUserId: string;
  currentUser: UserType;
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (memberId: string) => void;
  onAddChild?: (parentId: string) => void;
  onAddSpouse?: (memberId: string) => void;
}

export function ProfileCard({ member, currentUserId, currentUser, onEdit, onDelete, onAddChild, onAddSpouse }: ProfileCardProps) {
  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1 
      ? words[words.length - 2].charAt(0) + words[words.length - 1].charAt(0)
      : words[0].charAt(0);
  };

  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const relationship = getRelationship(currentUserId, member.id);

  const father = member.fatherId ? getFamilyMemberById(member.fatherId) : null;
  const mother = member.motherId ? getFamilyMemberById(member.motherId) : null;
  const spouses = member.spouseIds?.map(id => getFamilyMemberById(id)).filter(Boolean) || [];
  const children = member.childrenIds?.map(id => getFamilyMemberById(id)).filter(Boolean) || [];

  // Check permissions
  const canEdit = currentUser.role === 'admin' || 
                  currentUser.role === 'editor' || 
                  (currentUser.role === 'member' && currentUser.familyMemberId === member.id);
  
  const canDelete = currentUser.role === 'admin' || currentUser.role === 'editor';
  const isFemale = member.gender === 'female';
  const hideKey = `hideAddActions:${member.id}`;
  const [hideGlobalActions, setHideGlobalActions] = useState<boolean>(
    typeof window !== 'undefined' && localStorage.getItem(hideKey) === 'true'
  );

  const toggleHideActions = () => {
    const next = !hideGlobalActions;
    setHideGlobalActions(next);
    localStorage.setItem(hideKey, next ? 'true' : 'false');
    // Thông báo cho node tương ứng cập nhật
    window.dispatchEvent(new CustomEvent('family-tree:toggle-actions', { detail: { memberId: member.id } }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 flex-1 w-full">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
              <AvatarImage src={member.avatar} alt={member.fullName} />
              <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <CardTitle className="text-lg md:text-xl lg:text-2xl">{member.fullName}</CardTitle>
                <Badge variant={member.deathDate ? 'secondary' : 'default'} className="text-xs">
                  {relationship}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Thế hệ {member.generation}
                </Badge>
              </div>
              {member.deathDate && (
                <Badge variant="secondary" className="mb-2 text-xs">
                  Đã mất
                </Badge>
              )}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{calculateAge(member.birthDate, member.deathDate)} tuổi</span>
                </div>
              </div>
            </div>
          </div>
          {(canEdit || canDelete || (currentUser.role !== 'viewer')) && (
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {canEdit && onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(member)} className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
                  <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="hidden sm:inline">Sửa</span>
                </Button>
              )}
              {canDelete && onDelete && (
                <Button size="sm" variant="destructive" onClick={() => onDelete(member.id)} className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
                  <Trash className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="hidden sm:inline">Xóa</span>
                </Button>
              )}
              {currentUser.role !== 'viewer' && onAddChild && !isFemale && !hideGlobalActions && (
                <Button size="sm" variant="outline" onClick={() => onAddChild(member.id)} className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
                  <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="hidden sm:inline">Thêm con</span>
                </Button>
              )}
              {currentUser.role !== 'viewer' && onAddSpouse && !isFemale && !hideGlobalActions && (
                <Button size="sm" variant="outline" onClick={() => onAddSpouse(member.id)} className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
                  <HeartIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="hidden sm:inline">Thêm vợ/chồng</span>
                  {member.spouseIds && member.spouseIds.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      +{member.spouseIds.length}
                    </Badge>
                  )}
                </Button>
              )}
              {member.gender === 'male' && member.deathDate && (
                <Button size="sm" variant="outline" onClick={toggleHideActions} className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
                  {hideGlobalActions ? <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" /> : <EyeOff className="h-3 w-3 md:h-4 md:w-4 mr-1" />}
                  <span className="hidden sm:inline">{hideGlobalActions ? 'Hiện nút thêm' : 'Ẩn nút thêm'}</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <RelationshipViewer currentUserMemberId={currentUserId} targetMemberId={member.id} />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                Ngày sinh
              </h3>
              <p>{formatDate(member.birthDate)}</p>
            </div>

            {member.deathDate && (
              <div>
                <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Ngày mất
                </h3>
                <p>{formatDate(member.deathDate)}</p>
              </div>
            )}

            {member.address && (
              <div>
                <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ
                </h3>
                <p>{member.address}</p>
              </div>
            )}

            {member.occupation && (
              <div>
                <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                  <Briefcase className="h-4 w-4" />
                  Nghề nghiệp
                </h3>
                <p>{member.occupation}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {member.phone && (
              <div>
                <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </h3>
                <p>{member.phone}</p>
              </div>
            )}

            {member.email && (
              <div>
                <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                  <Mail className="h-4 w-4" />
                  Email
                </h3>
                <p>{member.email}</p>
              </div>
            )}

            {member.characteristics && member.characteristics.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 mb-2 text-gray-700">
                  <Heart className="h-4 w-4" />
                  Đặc điểm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.characteristics.map((char, index) => (
                    <Badge key={index} variant="secondary">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {member.description && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 text-gray-700">Mô tả</h3>
              <p className="text-gray-600">{member.description}</p>
            </div>
          </>
        )}

        <Separator />
        
        <div>
          <h3 className="flex items-center gap-2 mb-4 text-gray-700">
            <Users className="h-4 w-4" />
            Quan hệ gia đình
          </h3>
          <div className="space-y-3">
            {(father || mother) && (
              <div>
                <p className="mb-2">Cha mẹ:</p>
                <div className="flex flex-wrap gap-2">
                  {father && (
                    <Badge variant="outline">
                      Cha: {father.fullName}
                    </Badge>
                  )}
                  {mother && (
                    <Badge variant="outline">
                      Mẹ: {mother.fullName}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {spouses.length > 0 && (
              <div>
                <p className="mb-2">Vợ/Chồng ({spouses.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {spouses.map((spouse) => (
                    <Badge key={spouse?.id} variant="outline" className="text-xs">
                      {spouse?.fullName} {spouse?.deathDate && '✝'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {children.length > 0 && (
              <div>
                <p className="mb-2">Con cái ({children.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {children.map((child) => (
                    <Badge key={child?.id} variant="outline">
                      {child?.fullName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

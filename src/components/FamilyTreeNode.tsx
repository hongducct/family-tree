import { FamilyMember } from '../types/family';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { UserPlus, Heart } from 'lucide-react';

interface FamilyTreeNodeProps {
  member: FamilyMember;
  spouses?: FamilyMember[];
  onSelectMember: (memberId: string) => void;
  selectedMemberId?: string;
  onAddChild?: (parentId: string) => void;
  onAddSpouse?: (memberId: string) => void;
  canEdit?: boolean;
}

export function FamilyTreeNode({ 
  member, 
  spouses = [], 
  onSelectMember, 
  selectedMemberId,
  onAddChild,
  onAddSpouse,
  canEdit = false
}: FamilyTreeNodeProps) {
  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1 
      ? words[words.length - 2].charAt(0) + words[words.length - 1].charAt(0)
      : words[0].charAt(0);
  };

  const MemberCard = ({ person }: { person: FamilyMember }) => (
    <div
      onClick={() => onSelectMember(person.id)}
      className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${
        selectedMemberId === person.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
      }`}
    >
      <div className={`bg-white rounded-lg p-3 shadow-md border-2 ${
        person.gender === 'male' ? 'border-blue-300' : 'border-pink-300'
      } ${person.deathDate ? 'opacity-75' : ''} min-w-[100px]`}>
        <div className="flex flex-col items-center gap-1.5">
          <Avatar className="h-10 w-10">
            <AvatarImage src={person.avatar} alt={person.fullName} />
            <AvatarFallback className={
              person.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
            }>
              {getInitials(person.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-xs line-clamp-2">{person.fullName}</p>
            <p className="text-xs text-gray-500">
              {new Date(person.birthDate).getFullYear()}
              {person.deathDate && <span> - {new Date(person.deathDate).getFullYear()}</span>}
            </p>
          </div>
          {person.deathDate && (
            <Badge variant="secondary" className="text-xs py-0">
              ✝
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  const hasSpouses = spouses.length > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Nhóm vợ chồng */}
      <div className="flex items-center gap-2 relative">
        {/* Thành viên chính */}
        <MemberCard person={member} />
        
        {/* Các vợ/chồng */}
        {hasSpouses && (
          <>
            {spouses.map((spouse, index) => (
              <div key={spouse.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="text-lg">💑</div>
                </div>
                <MemberCard person={spouse} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Các nút thao tác */}
      {canEdit && (
        <div className="flex flex-wrap gap-2 justify-center">
          {onAddChild && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(member.id);
              }}
              className="text-xs gap-1 h-7"
            >
              <UserPlus className="h-3 w-3" />
              Thêm con
            </Button>
          )}
          {onAddSpouse && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddSpouse(member.id);
              }}
              className="text-xs gap-1 h-7"
            >
              <Heart className="h-3 w-3" />
              Thêm vợ/chồng
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

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
      <div className={`bg-white rounded-lg p-2 md:p-3 shadow-md border-2 ${
        person.gender === 'male' ? 'border-blue-300' : 'border-pink-300'
      } ${person.deathDate ? 'opacity-75' : ''} min-w-[80px] md:min-w-[100px]`}>
        <div className="flex flex-col items-center gap-1 md:gap-1.5">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src={person.avatar} alt={person.fullName} />
            <AvatarFallback className={
              person.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
            }>
              {getInitials(person.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-xs md:text-xs line-clamp-2">{person.fullName}</p>
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
      <div className="flex flex-col md:flex-row items-center gap-2 relative">
        {/* Thành viên chính */}
        <MemberCard person={member} />
        
        {/* Các vợ/chồng */}
        {hasSpouses && (
          <>
            {spouses.map((spouse, index) => (
              <div key={spouse.id} className="flex flex-col md:flex-row items-center gap-2 relative">
                {/* Đường line nối vợ chồng */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <div className="w-8 h-0.5 bg-gray-600"></div>
                </div>
                {/* Icon vợ chồng */}
                <div className="flex flex-col items-center relative z-20">
                  <div className="text-lg bg-white rounded-full p-1">💑</div>
                </div>
                <MemberCard person={spouse} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Các nút thao tác */}
      {canEdit && (
        <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
          {onAddChild && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(member.id);
              }}
              className="text-xs gap-1 h-6 md:h-7 px-2 md:px-3"
            >
              <UserPlus className="h-3 w-3" />
              <span className="hidden sm:inline">Thêm con</span>
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
              className="text-xs gap-1 h-6 md:h-7 px-2 md:px-3"
            >
              <Heart className="h-3 w-3" />
              <span className="hidden sm:inline">Thêm vợ/chồng</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

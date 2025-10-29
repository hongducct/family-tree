import { FamilyMember } from '../types/family';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { UserPlus, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

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
      } ${person.deathDate ? 'opacity-75' : ''} min-w-[120px]`}>
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
  const isFemale = member.gender === 'female';
  const hideKey = `hideAddActions:${member.id}`;
  const [hideSelfActions, setHideSelfActions] = useState<boolean>(false);

  useEffect(() => {
    const read = () => setHideSelfActions(localStorage.getItem(hideKey) === 'true');
    read();

    const onToggle = (e: Event) => {
      const ce = e as CustomEvent<{ memberId: string }>;
      if (ce.detail && ce.detail.memberId === member.id) read();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === hideKey) read();
    };

    window.addEventListener('family-tree:toggle-actions', onToggle as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('family-tree:toggle-actions', onToggle as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [hideKey, member.id]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Nhóm vợ chồng */}
      <div className="flex items-center relative">
        {/* Thành viên chính */}
        <MemberCard person={member} />
        
        {/* Các vợ/chồng */}
        {hasSpouses && (
          <>
            {spouses.map((spouse, index) => (
              <div key={spouse.id} className="relative flex items-center">
                {/* Đường line nối vợ chồng */}
                <div className="relative flex items-center justify-center mx-2" style={{ width: '60px', height: '2px' }}>
                  <div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      backgroundColor: '#000000',
                      height: '2px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  {/* Icon vợ chồng */}
                  <div className="relative z-20 bg-white px-1 pointer-events-auto">
                    <div className="text-base">💑</div>
                  </div>
                </div>
                <MemberCard person={spouse} />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Các nút thao tác */}
      {canEdit && !isFemale && !hideSelfActions && (
        <div className="flex flex-wrap gap-2 justify-center">
          {onAddChild && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(member.id);
              }}
              className="text-xs gap-1 h-7 px-3"
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
              className="text-xs gap-1 h-7 px-3"
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

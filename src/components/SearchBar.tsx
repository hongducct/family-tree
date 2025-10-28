import { useState } from 'react';
import { Input } from './ui/input';
import { Search, X } from 'lucide-react';
import { FamilyMember } from '../types/family';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { getRelationship } from '../data/mockData';

interface SearchBarProps {
  members: FamilyMember[];
  onSelectMember: (memberId: string) => void;
  currentUserId: string;
}

export function SearchBar({ members, onSelectMember, currentUserId }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1 
      ? words[words.length - 2].charAt(0) + words[words.length - 1].charAt(0)
      : words[0].charAt(0);
  };

  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (memberId: string) => {
    onSelectMember(memberId);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm người thân theo tên, nghề nghiệp, địa chỉ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && searchTerm && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowResults(false)}
          />
          <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-20 shadow-lg">
            {filteredMembers.length > 0 ? (
              <div className="p-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleSelect(member.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.fullName} />
                      <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate">{member.fullName}</p>
                        <Badge variant="secondary" className="text-xs">
                          {getRelationship(currentUserId, member.id)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {member.occupation}
                        {member.occupation && member.address && ' • '}
                        {member.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy kết quả
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

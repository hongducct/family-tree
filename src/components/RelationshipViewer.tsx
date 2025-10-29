import { useEffect, useMemo, useState } from 'react';
import { FamilyMember } from '../types/family';
import { mockFamilyMembers, getFamilyMemberById } from '../data/mockData';
import { computeRelation } from '../utils/relations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface RelationshipViewerProps {
  currentUserMemberId?: string;
  targetMemberId: string;
  members?: FamilyMember[];
}

export function RelationshipViewer({ currentUserMemberId, targetMemberId, members = mockFamilyMembers }: RelationshipViewerProps) {
  const [fromId, setFromId] = useState<string | undefined>(currentUserMemberId);

  useEffect(() => {
    setFromId(currentUserMemberId);
  }, [currentUserMemberId]);

  const relation = useMemo(() => {
    if (!fromId) return null;
    return computeRelation(fromId, targetMemberId, members);
  }, [fromId, targetMemberId, members]);

  const fromMember = fromId ? getFamilyMemberById(fromId) : undefined;
  const toMember = getFamilyMemberById(targetMemberId);

  return (
    <div className="rounded-md border bg-white p-3">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Quan hệ giữa</span>
          <Select value={fromId} onValueChange={(v) => setFromId(v)}>
            <SelectTrigger className="h-8 w-[220px]">
              <SelectValue placeholder="Chọn người A" />
            </SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.fullName} (Thế hệ {m.generation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">và</span>
          <Badge variant="secondary">{toMember?.fullName}</Badge>
        </div>

        {relation ? (
          <div className="text-sm">
            <p className="mb-1">
              <span className="font-medium">Kết luận:</span> {relation.labelVi}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-gray-600">
              {relation.pathMemberIds.map((id, idx) => {
                const m = getFamilyMemberById(id);
                const step = relation.steps[idx - 1];
                return (
                  <div key={id} className="flex items-center gap-2">
                    {idx > 0 && (
                      <span className="text-xs text-gray-400">
                        {step === 'U' && '↑'}{step === 'D' && '↓'}{step === 'S' && '↔'}
                      </span>
                    )}
                    <Badge variant="outline">{m?.fullName}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chọn người A để xem quan hệ.</p>
        )}
      </div>
    </div>
  );
}



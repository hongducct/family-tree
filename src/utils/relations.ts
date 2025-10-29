import { FamilyMember } from '../types/family';
import { mockFamilyMembers } from '../data/mockData';

type Step = 'U' | 'D' | 'S';

export interface RelationPath {
  pathMemberIds: string[];
  steps: Step[];
  labelVi: string;
}

function getNeighbors(member: FamilyMember, idToMember: Map<string, FamilyMember>): { id: string; step: Step }[] {
  const neighbors: { id: string; step: Step }[] = [];
  // Parents (U)
  if (member.fatherId) neighbors.push({ id: member.fatherId, step: 'U' });
  if (member.motherId) neighbors.push({ id: member.motherId, step: 'U' });
  // Children (D)
  member.childrenIds?.forEach((cid) => neighbors.push({ id: cid, step: 'D' }));
  // Spouses (S)
  member.spouseIds?.forEach((sid) => neighbors.push({ id: sid, step: 'S' }));
  return neighbors.filter((n) => idToMember.has(n.id));
}

function stepsToLabel(steps: Step[]): string {
  const s = steps.join('');
  // Một số mẫu phổ biến
  const map: Record<string, string> = {
    '': 'Chính là bạn',
    'S': 'Vợ/Chồng',
    'U': 'Cha/Mẹ',
    'D': 'Con',
    'DU': 'Anh/Chị/Em',
    'UD': 'Anh/Chị/Em',
    'UU': 'Ông/Bà',
    'DD': 'Cháu',
    'US': 'Cha/Mẹ vợ/chồng',
    'SU': 'Bố/Mẹ của vợ/chồng',
    'DS': 'Con rể/Dâu',
    'SD': 'Con của vợ/chồng',
    'UUU': 'Cụ',
    'DDD': 'Chắt',
  };
  if (map[s]) return map[s];
  // Heuristic đơn giản
  const up = steps.filter((x) => x === 'U').length;
  const down = steps.filter((x) => x === 'D').length;
  if (up > 0 && down > 0 && steps.includes('S')) return 'Họ hàng bên thông gia';
  if (up > down) return `${'Cụ '.repeat(up - 2)}Ông/Bà`;
  if (down > up) return `${'Chắt '.repeat(down - 2)}Cháu`;
  return 'Họ hàng';
}

export function computeRelation(fromId: string, toId: string, members: FamilyMember[] = mockFamilyMembers): RelationPath | null {
  if (!fromId || !toId) return null;
  if (fromId === toId) return { pathMemberIds: [fromId], steps: [], labelVi: 'Chính là bạn' };

  const idToMember = new Map<string, FamilyMember>();
  members.forEach((m) => idToMember.set(m.id, m));

  const visited = new Set<string>();
  const queue: { id: string; path: string[]; steps: Step[] }[] = [{ id: fromId, path: [fromId], steps: [] }];
  visited.add(fromId);

  const MAX_DEPTH = 10;

  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.id === toId) {
      return { pathMemberIds: cur.path, steps: cur.steps, labelVi: stepsToLabel(cur.steps) };
    }
    if (cur.steps.length >= MAX_DEPTH) continue;
    const member = idToMember.get(cur.id);
    if (!member) continue;
    for (const n of getNeighbors(member, idToMember)) {
      if (visited.has(n.id)) continue;
      visited.add(n.id);
      queue.push({ id: n.id, path: [...cur.path, n.id], steps: [...cur.steps, n.step] });
    }
  }

  return null;
}



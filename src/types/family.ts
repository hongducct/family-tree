export interface FamilyMember {
  id: string;
  fullName: string;
  avatar?: string;
  birthDate: string;
  deathDate?: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  occupation?: string;
  description?: string;
  characteristics?: string[];
  phone?: string;
  email?: string;
  
  // Relationships
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  childrenIds?: string[];
  generation: number; // Thế hệ (1 = ông bà cố, 2 = ông bà, 3 = cha mẹ, 4 = bản thân, etc.)
}

export type UserRole = 'admin' | 'editor' | 'member' | 'viewer';

export interface User {
  id: string;
  email: string;
  password: string;
  familyMemberId: string;
  role: UserRole;
  name: string;
}

export interface PendingChange {
  id: string;
  type: 'add' | 'edit' | 'delete';
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  data: Partial<FamilyMember>;
  originalData?: FamilyMember;
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
}

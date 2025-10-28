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
  
  // Family association
  familyId: string;
}

export type FamilyRole = 'admin' | 'editor' | 'member' | 'viewer';
export type SystemRole = 'system_admin' | 'user';

export interface Family {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  publicUrl?: string;
  settings: {
    allowPublicView: boolean;
    allowMemberInvite: boolean;
    requireApproval: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  systemRole: SystemRole;
  createdAt: string;
  
  // Family memberships
  familyMemberships: FamilyMembership[];
  currentFamilyId?: string;
}

export interface FamilyMembership {
  familyId: string;
  familyMemberId?: string; // ID của FamilyMember tương ứng
  role: FamilyRole;
  joinedAt: string;
  invitedBy?: string;
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
  familyId: string;
}

export interface FamilyInvitation {
  id: string;
  familyId: string;
  invitedEmail: string;
  invitedBy: string;
  role: FamilyRole;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string;
}
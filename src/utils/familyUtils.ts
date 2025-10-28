import { User, Family, FamilyMember } from '../types/family';
import { getUserById, getFamilyById, getFamilyMembers } from '../data/mockData';

export const canUserAccessFamily = (userId: string, familyId: string): boolean => {
  const user = getUserById(userId);
  if (!user) return false;
  
  return user.familyMemberships.some(membership => membership.familyId === familyId);
};

export const canUserEditInFamily = (userId: string, familyId: string): boolean => {
  const user = getUserById(userId);
  if (!user) return false;
  
  const membership = user.familyMemberships.find(m => m.familyId === familyId);
  if (!membership) return false;
  
  return membership.role === 'admin' || membership.role === 'editor';
};

export const canUserViewInFamily = (userId: string, familyId: string): boolean => {
  const user = getUserById(userId);
  if (!user) return false;
  
  // Check if user is member of family
  const membership = user.familyMemberships.find(m => m.familyId === familyId);
  if (membership) return true;
  
  // Check if family is public
  const family = getFamilyById(familyId);
  return family?.isPublic || false;
};

export const getUserCurrentFamily = (user: User): Family | null => {
  if (!user.currentFamilyId) return null;
  return getFamilyById(user.currentFamilyId) || null;
};

export const switchUserFamily = (user: User, familyId: string): boolean => {
  const canAccess = canUserAccessFamily(user.id, familyId);
  if (!canAccess) return false;
  
  user.currentFamilyId = familyId;
  return true;
};

export const generateFamilyUrl = (family: Family): string => {
  if (!family.publicUrl) {
    // Generate URL from family name
    const baseUrl = family.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    return `${baseUrl}-${family.id.slice(-6)}`;
  }
  return family.publicUrl;
};

export const getFamilyStats = (familyId: string) => {
  const members = getFamilyMembers(familyId);
  
  const generations = new Set(members.map(m => m.generation));
  const maleCount = members.filter(m => m.gender === 'male').length;
  const femaleCount = members.filter(m => m.gender === 'female').length;
  const livingCount = members.filter(m => !m.deathDate).length;
  const deceasedCount = members.filter(m => m.deathDate).length;
  
  return {
    totalMembers: members.length,
    generations: generations.size,
    maleCount,
    femaleCount,
    livingCount,
    deceasedCount,
    generationRange: generations.size > 0 ? {
      min: Math.min(...generations),
      max: Math.max(...generations)
    } : null
  };
};
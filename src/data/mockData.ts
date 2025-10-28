import { FamilyMember, User, PendingChange, Family, FamilyMembership, FamilyInvitation } from '../types/family';

// Families data
export const mockFamilies: Family[] = [
  {
    id: 'family1',
    name: 'Gia đình Nguyễn Văn Tổ',
    description: 'Dòng họ Nguyễn tại Hà Nội',
    createdBy: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    isPublic: false,
    settings: {
      allowPublicView: false,
      allowMemberInvite: true,
      requireApproval: true
    }
  },
  {
    id: 'family2', 
    name: 'Gia đình Trần Văn Minh',
    description: 'Dòng họ Trần tại TP.HCM',
    createdBy: 'user5',
    createdAt: '2024-01-15T00:00:00Z',
    isPublic: true,
    publicUrl: 'tran-van-minh-family',
    settings: {
      allowPublicView: true,
      allowMemberInvite: false,
      requireApproval: true
    }
  }
];

// Updated Users data
export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'admin@example.com',
    password: '123456',
    name: 'Nguyễn Văn An',
    systemRole: 'user',
    createdAt: '2024-01-01T00:00:00Z',
    familyMemberships: [
      {
        familyId: 'family1',
        familyMemberId: 'member7',
        role: 'admin',
        joinedAt: '2024-01-01T00:00:00Z'
      }
    ],
    currentFamilyId: 'family1'
  },
  {
    id: 'user2',
    email: 'editor@example.com',
    password: '123456',
    name: 'Nguyễn Thị Hương',
    systemRole: 'user',
    createdAt: '2024-01-02T00:00:00Z',
    familyMemberships: [
      {
        familyId: 'family1',
        familyMemberId: 'member8',
        role: 'editor',
        joinedAt: '2024-01-02T00:00:00Z'
      }
    ],
    currentFamilyId: 'family1'
  },
  {
    id: 'user3',
    email: 'member@example.com',
    password: '123456',
    name: 'Nguyễn Minh Đức',
    systemRole: 'user',
    createdAt: '2024-01-03T00:00:00Z',
    familyMemberships: [
      {
        familyId: 'family1',
        familyMemberId: 'member13',
        role: 'member',
        joinedAt: '2024-01-03T00:00:00Z'
      }
    ],
    currentFamilyId: 'family1'
  },
  {
    id: 'user4',
    email: 'viewer@example.com',
    password: '123456',
    name: 'Nguyễn Thu Hà',
    systemRole: 'user',
    createdAt: '2024-01-04T00:00:00Z',
    familyMemberships: [
      {
        familyId: 'family1',
        familyMemberId: 'member14',
        role: 'viewer',
        joinedAt: '2024-01-04T00:00:00Z'
      }
    ],
    currentFamilyId: 'family1'
  },
  {
    id: 'user5',
    email: 'tran.minh@example.com',
    password: '123456',
    name: 'Trần Văn Minh',
    systemRole: 'user',
    createdAt: '2024-01-15T00:00:00Z',
    familyMemberships: [
      {
        familyId: 'family2',
        familyMemberId: 'member_tran1',
        role: 'admin',
        joinedAt: '2024-01-15T00:00:00Z'
      }
    ],
    currentFamilyId: 'family2'
  }
];

export let pendingChanges: PendingChange[] = [];
export let familyInvitations: FamilyInvitation[] = [];

// Updated Family Members - Family 1 (Nguyễn)
export const mockFamilyMembers: FamilyMember[] = [
  // Thế hệ 1 - Ông bà cố
  {
    id: 'member1',
    fullName: 'Nguyễn Văn Tổ',
    birthDate: '1920-05-15',
    deathDate: '1995-08-20',
    gender: 'male',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Nông dân',
    description: 'Người sáng lập dòng họ Nguyễn tại làng',
    characteristics: ['Hiền lành', 'Chăm chỉ', 'Có uy tín'],
    generation: 1,
    spouseIds: ['member2', 'member2b'],
    childrenIds: ['member3', 'member4'],
    familyId: 'family1'
  },
  {
    id: 'member2',
    fullName: 'Trần Thị Lan',
    birthDate: '1925-03-10',
    deathDate: '2000-12-05',
    gender: 'female',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Nội trợ',
    description: 'Người phụ nữ hiền thục, tần tảo - Vợ cả',
    characteristics: ['Tốt bụng', 'Chăm sóc gia đình'],
    generation: 1,
    spouseIds: ['member1'],
    childrenIds: ['member3'],
    familyId: 'family1'
  },
  {
    id: 'member2b',
    fullName: 'Lê Thị Hương',
    birthDate: '1928-07-20',
    deathDate: '2005-03-15',
    gender: 'female',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Nội trợ',
    description: 'Vợ hai, hiền lành và chăm chỉ',
    characteristics: ['Nhẫn nại', 'Tốt bụng'],
    generation: 1,
    spouseIds: ['member1'],
    childrenIds: ['member4'],
    familyId: 'family1'
  },
  
  // Thế hệ 2 - Ông bà
  {
    id: 'member3',
    fullName: 'Nguyễn Văn Hùng',
    birthDate: '1950-07-20',
    deathDate: '2018-04-15',
    gender: 'male',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Giáo viên',
    description: 'Thầy giáo có uy tín, tận tâm với nghề',
    characteristics: ['Nghiêm khắc', 'Tận tâm', 'Yêu thương học trò'],
    generation: 2,
    fatherId: 'member1',
    motherId: 'member2',
    spouseIds: ['member5'],
    childrenIds: ['member7', 'member8'],
    familyId: 'family1'
  },
  {
    id: 'member4',
    fullName: 'Nguyễn Văn Dũng',
    birthDate: '1955-11-30',
    gender: 'male',
    address: 'Hải Phòng, Việt Nam',
    occupation: 'Bác sĩ',
    description: 'Bác sĩ nội trú tại bệnh viện lớn',
    characteristics: ['Chuyên nghiệp', 'Tâm huyết với bệnh nhân'],
    generation: 2,
    fatherId: 'member1',
    motherId: 'member2b',
    spouseIds: ['member6'],
    childrenIds: ['member9', 'member10'],
    familyId: 'family1'
  },
  {
    id: 'member5',
    fullName: 'Phạm Thị Mai',
    birthDate: '1952-09-12',
    gender: 'female',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Y tá',
    description: 'Y tá chăm sóc cộng đồng',
    characteristics: ['Chu đáo', 'Nhiệt tình'],
    generation: 2,
    spouseIds: ['member3'],
    childrenIds: ['member7', 'member8'],
    familyId: 'family1'
  },
  {
    id: 'member6',
    fullName: 'Lê Thị Hoa',
    birthDate: '1958-02-25',
    gender: 'female',
    address: 'Hải Phòng, Việt Nam',
    occupation: 'Dược sĩ',
    description: 'Dược sĩ tại nhà thuốc',
    characteristics: ['Cẩn thận', 'Tỉ mỉ'],
    generation: 2,
    spouseIds: ['member4'],
    childrenIds: ['member9', 'member10'],
    familyId: 'family1'
  },
  
  // Thế hệ 3 - Cha mẹ
  {
    id: 'member7',
    fullName: 'Nguyễn Văn An',
    birthDate: '1980-06-15',
    gender: 'male',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Kỹ sư phần mềm',
    description: 'Làm việc tại công ty công nghệ',
    characteristics: ['Thông minh', 'Ham học hỏi', 'Yêu công nghệ'],
    phone: '0912345678',
    email: 'nguyen.van.a@example.com',
    generation: 3,
    fatherId: 'member3',
    motherId: 'member5',
    spouseIds: ['member11'],
    childrenIds: ['member13', 'member14'],
    familyId: 'family1'
  },
  {
    id: 'member8',
    fullName: 'Nguyễn Thị Hương',
    birthDate: '1983-03-22',
    gender: 'female',
    address: 'Hồ Chí Minh, Việt Nam',
    occupation: 'Nhà thiết kế',
    description: 'Nhà thiết kế thời trang độc lập',
    characteristics: ['Sáng tạo', 'Nhiệt huyết', 'Thẩm mỹ cao'],
    phone: '0923456789',
    email: 'nguyen.thi.huong@example.com',
    generation: 3,
    fatherId: 'member3',
    motherId: 'member5',
    spouseIds: ['member12'],
    childrenIds: ['member15'],
    familyId: 'family1'
  },
  {
    id: 'member9',
    fullName: 'Nguyễn Văn Bình',
    birthDate: '1985-08-10',
    gender: 'male',
    address: 'Hải Phòng, Việt Nam',
    occupation: 'Doanh nhân',
    description: 'Chủ doanh nghiệp xuất nhập khẩu',
    characteristics: ['Quyết đoán', 'Có tầm nhìn kinh doanh'],
    phone: '0934567890',
    email: 'nguyen.van.binh@example.com',
    generation: 3,
    fatherId: 'member4',
    motherId: 'member6',
    childrenIds: ['member16'],
    familyId: 'family1'
  },
  {
    id: 'member10',
    fullName: 'Nguyễn Thị Lan',
    birthDate: '1988-12-05',
    gender: 'female',
    address: 'Đà Nẵng, Việt Nam',
    occupation: 'Giảng viên đại học',
    description: 'Giảng viên khoa Văn học',
    characteristics: ['Uyên bác', 'Nhiệt tình giảng dạy'],
    phone: '0945678901',
    email: 'nguyen.thi.lan@example.com',
    generation: 3,
    fatherId: 'member4',
    motherId: 'member6',
    childrenIds: ['member17', 'member18'],
    familyId: 'family1'
  },
  
  // Vợ/chồng thế hệ 3
  {
    id: 'member11',
    fullName: 'Hoàng Thị Thu',
    birthDate: '1982-04-18',
    gender: 'female',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Kế toán',
    description: 'Kế toán trưởng công ty',
    characteristics: ['Tỉ mỉ', 'Cẩn thận', 'Có trách nhiệm'],
    phone: '0956789012',
    email: 'hoang.thi.thu@example.com',
    generation: 3,
    spouseIds: ['member7'],
    childrenIds: ['member13', 'member14'],
    familyId: 'family1'
  },
  {
    id: 'member12',
    fullName: 'Trần Văn Minh',
    birthDate: '1981-09-25',
    gender: 'male',
    address: 'Hồ Chí Minh, Việt Nam',
    occupation: 'Nhiếp ảnh gia',
    description: 'Nhiếp ảnh gia chuyên nghiệp',
    characteristics: ['Sáng tạo', 'Tỉ mỉ', 'Có con mắt nghệ thuật'],
    phone: '0967890123',
    email: 'tran.van.minh@example.com',
    generation: 3,
    spouseIds: ['member8'],
    childrenIds: ['member15'],
    familyId: 'family1'
  },
  
  // Thế hệ 4 - Con cái
  {
    id: 'member13',
    fullName: 'Nguyễn Minh Đức',
    birthDate: '2005-03-12',
    gender: 'male',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Học sinh',
    description: 'Học sinh lớp 12, đam mê lập trình',
    characteristics: ['Thông minh', 'Chăm chỉ', 'Thích công nghệ'],
    generation: 4,
    fatherId: 'member7',
    motherId: 'member11',
    familyId: 'family1'
  },
  {
    id: 'member14',
    fullName: 'Nguyễn Thu Hà',
    birthDate: '2008-07-20',
    gender: 'female',
    address: 'Hà Nội, Việt Nam',
    occupation: 'Học sinh',
    description: 'Học sinh lớp 9, yêu thích âm nhạc',
    characteristics: ['Hiền lành', 'Tài năng nghệ thuật', 'Chăm học'],
    generation: 4,
    fatherId: 'member7',
    motherId: 'member11',
    familyId: 'family1'
  },
  {
    id: 'member15',
    fullName: 'Trần Ngọc Anh',
    birthDate: '2010-11-08',
    gender: 'female',
    address: 'Hồ Chí Minh, Việt Nam',
    occupation: 'Học sinh',
    description: 'Học sinh lớp 7, đam mê vẽ',
    characteristics: ['Sáng tạo', 'Năng động', 'Yêu nghệ thuật'],
    generation: 4,
    fatherId: 'member12',
    motherId: 'member8',
    familyId: 'family1'
  },
  {
    id: 'member16',
    fullName: 'Nguyễn Hoàng Long',
    birthDate: '2012-05-15',
    gender: 'male',
    address: 'Hải Phòng, Việt Nam',
    occupation: 'Học sinh',
    description: 'Học sinh lớp 5, thích thể thao',
    characteristics: ['Khỏe mạnh', 'Năng động', 'Vui vẻ'],
    generation: 4,
    fatherId: 'member9',
    familyId: 'family1'
  },
  {
    id: 'member17',
    fullName: 'Nguyễn Phương Anh',
    birthDate: '2014-09-20',
    gender: 'female',
    address: 'Đà Nẵng, Việt Nam',
    occupation: 'Học sinh',
    description: 'Học sinh lớp 3, học giỏi',
    characteristics: ['Thông minh', 'Chăm chỉ', 'Ngoan ngoãn'],
    generation: 4,
    motherId: 'member10',
    familyId: 'family1'
  },
  {
    id: 'member18',
    fullName: 'Nguyễn Bảo Nam',
    birthDate: '2017-02-14',
    gender: 'male',
    address: 'Đà Nẵng, Việt Nam',
    occupation: 'Học sinh',
    description: 'Học sinh lớp 1, hoạt bát',
    characteristics: ['Năng động', 'Vui vẻ', 'Thích khám phá'],
    generation: 4,
    motherId: 'member10',
    familyId: 'family1'
  },

  // Family 2 (Trần) - Sample members
  {
    id: 'member_tran1',
    fullName: 'Trần Văn Minh',
    birthDate: '1975-03-10',
    gender: 'male',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    occupation: 'Kiến trúc sư',
    description: 'Kiến trúc sư trưởng tại công ty thiết kế',
    characteristics: ['Sáng tạo', 'Tỉ mỉ', 'Có tầm nhìn'],
    generation: 1,
    childrenIds: ['member_tran2'],
    familyId: 'family2'
  },
  {
    id: 'member_tran2',
    fullName: 'Trần Thị Mai',
    birthDate: '2000-08-15',
    gender: 'female',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    occupation: 'Sinh viên',
    description: 'Sinh viên năm cuối ngành Thiết kế đồ họa',
    characteristics: ['Năng động', 'Sáng tạo', 'Thích khám phá'],
    generation: 2,
    fatherId: 'member_tran1',
    familyId: 'family2'
  }
];

let currentLoggedInUser: User | null = null;

export const setCurrentUser = (user: User) => {
  currentLoggedInUser = user;
};

export const getCurrentUser = (): User | null => {
  return currentLoggedInUser;
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email === email);
};

export const getFamilyById = (id: string): Family | undefined => {
  return mockFamilies.find(f => f.id === id);
};

export const getFamilyMemberById = (id: string): FamilyMember | undefined => {
  return mockFamilyMembers.find(m => m.id === id);
};

export const getFamilyMembers = (familyId: string): FamilyMember[] => {
  return mockFamilyMembers.filter(m => m.familyId === familyId);
};

export const getUserFamilies = (userId: string): Family[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  return user.familyMemberships
    .map(membership => getFamilyById(membership.familyId))
    .filter(family => family !== undefined) as Family[];
};

export const getUserRoleInFamily = (userId: string, familyId: string): string | null => {
  const user = getUserById(userId);
  if (!user) return null;
  
  const membership = user.familyMemberships.find(m => m.familyId === familyId);
  return membership?.role || null;
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'familyMemberships' | 'systemRole'>): User => {
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
    systemRole: 'user',
    familyMemberships: []
  };
  
  mockUsers.push(newUser);
  return newUser;
};

export const createFamily = (name: string, description: string, createdBy: string): Family => {
  const newFamily: Family = {
    id: `family_${Date.now()}`,
    name,
    description,
    createdBy,
    createdAt: new Date().toISOString(),
    isPublic: false,
    settings: {
      allowPublicView: false,
      allowMemberInvite: true,
      requireApproval: true
    }
  };
  
  mockFamilies.push(newFamily);
  
  // Add creator as admin
  const user = getUserById(createdBy);
  if (user) {
    user.familyMemberships.push({
      familyId: newFamily.id,
      role: 'admin',
      joinedAt: new Date().toISOString()
    });
    user.currentFamilyId = newFamily.id;
  }
  
  return newFamily;
};

export const addPendingChange = (change: Omit<PendingChange, 'id' | 'submittedAt' | 'status'>) => {
  const newChange: PendingChange = {
    ...change,
    id: `change-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  pendingChanges.push(newChange);
  return newChange;
};

export const approvePendingChange = (changeId: string, reviewerId: string) => {
  const change = pendingChanges.find(c => c.id === changeId);
  if (!change) return false;

  change.status = 'approved';
  change.reviewedBy = reviewerId;
  change.reviewedAt = new Date().toISOString();

  // Apply the change
  if (change.type === 'add' && change.data.id) {
    mockFamilyMembers.push(change.data as FamilyMember);
  } else if (change.type === 'edit' && change.data.id) {
    const index = mockFamilyMembers.findIndex(m => m.id === change.data.id);
    if (index !== -1) {
      mockFamilyMembers[index] = { ...mockFamilyMembers[index], ...change.data };
    }
  } else if (change.type === 'delete' && change.data.id) {
    const index = mockFamilyMembers.findIndex(m => m.id === change.data.id);
    if (index !== -1) {
      mockFamilyMembers.splice(index, 1);
    }
  }

  return true;
};

export const rejectPendingChange = (changeId: string, reviewerId: string, reason: string) => {
  const change = pendingChanges.find(c => c.id === changeId);
  if (!change) return false;

  change.status = 'rejected';
  change.reviewedBy = reviewerId;
  change.reviewedAt = new Date().toISOString();
  change.reason = reason;

  return true;
};

export const getPendingChanges = (familyId?: string) => {
  let changes = pendingChanges.filter(c => c.status === 'pending');
  if (familyId) {
    changes = changes.filter(c => c.familyId === familyId);
  }
  return changes;
};

export const getRelationship = (fromId: string, toId: string): string => {
  const from = getFamilyMemberById(fromId);
  const to = getFamilyMemberById(toId);
  
  if (!from || !to) return 'Không xác định';
  if (fromId === toId) return 'Bản thân';
  
  // Cha mẹ
  if (from.fatherId === toId) return 'Cha';
  if (from.motherId === toId) return 'Mẹ';
  
  // Con
  if (from.childrenIds?.includes(toId)) {
    return to.gender === 'male' ? 'Con trai' : 'Con gái';
  }
  
  // Vợ chồng
  if (from.spouseIds?.includes(toId)) {
    return from.gender === 'male' ? 'Vợ' : 'Chồng';
  }
  
  // Anh chị em
  if (from.fatherId && to.fatherId && from.fatherId === to.fatherId) {
    if (from.generation === to.generation) {
      return to.gender === 'male' ? 'Anh/Em trai' : 'Chị/Em gái';
    }
  }
  
  // Ông bà
  const father = from.fatherId ? getFamilyMemberById(from.fatherId) : null;
  const mother = from.motherId ? getFamilyMemberById(from.motherId) : null;
  if (father?.fatherId === toId || mother?.fatherId === toId) return 'Ông nội/ngoại';
  if (father?.motherId === toId || mother?.motherId === toId) return 'Bà nội/ngoại';
  
  // Cháu
  if (from.childrenIds) {
    for (const childId of from.childrenIds) {
      const child = getFamilyMemberById(childId);
      if (child?.childrenIds?.includes(toId)) {
        return to.gender === 'male' ? 'Cháu trai' : 'Cháu gái';
      }
    }
  }
  
  // Chú bác cô dì
  if (father) {
    const grandFather = father.fatherId ? getFamilyMemberById(father.fatherId) : null;
    if (grandFather?.childrenIds?.includes(toId) && toId !== father.id) {
      return to.gender === 'male' ? 'Chú/Bác' : 'Cô/Dì';
    }
  }
  
  return 'Họ hàng';
};
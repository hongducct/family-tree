import { FamilyMember, User, PendingChange } from '../types/family';

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'admin@example.com',
    password: '123456',
    familyMemberId: 'member7',
    role: 'admin',
    name: 'Nguyễn Văn An (Admin)'
  },
  {
    id: 'user2',
    email: 'editor@example.com',
    password: '123456',
    familyMemberId: 'member8',
    role: 'editor',
    name: 'Nguyễn Thị Hương (Editor)'
  },
  {
    id: 'user3',
    email: 'member@example.com',
    password: '123456',
    familyMemberId: 'member13',
    role: 'member',
    name: 'Nguyễn Minh Đức (Member)'
  },
  {
    id: 'user4',
    email: 'viewer@example.com',
    password: '123456',
    familyMemberId: 'member14',
    role: 'viewer',
    name: 'Nguyễn Thu Hà (Viewer)'
  }
];

export let pendingChanges: PendingChange[] = [];

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
    spouseIds: ['member2', 'member2b'], // Có 2 vợ
    childrenIds: ['member3', 'member4']
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
    childrenIds: ['member3']
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
    childrenIds: ['member4']
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
    childrenIds: ['member7', 'member8']
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
    motherId: 'member2',
    spouseIds: ['member6'],
    childrenIds: ['member9', 'member10']
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
    childrenIds: ['member7', 'member8']
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
    childrenIds: ['member9', 'member10']
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
    childrenIds: ['member13', 'member14']
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
    childrenIds: ['member15']
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
    childrenIds: ['member16']
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
    childrenIds: ['member17', 'member18']
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
    childrenIds: ['member13', 'member14']
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
    childrenIds: ['member15']
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
    motherId: 'member11'
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
    motherId: 'member11'
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
    motherId: 'member8'
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
    fatherId: 'member9'
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
    motherId: 'member10'
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
    motherId: 'member10'
  }
];

let currentLoggedInUser: User | null = null;

export const setCurrentUser = (user: User) => {
  currentLoggedInUser = user;
};

export const getCurrentUser = (): User => {
  return currentLoggedInUser || mockUsers[0];
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getFamilyMemberById = (id: string): FamilyMember | undefined => {
  return mockFamilyMembers.find(m => m.id === id);
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

export const getPendingChanges = () => {
  return pendingChanges.filter(c => c.status === 'pending');
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

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { FamilyMember } from '../types/family';
import { mockFamilyMembers, getFamilyMemberById } from '../data/mockData';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, X } from 'lucide-react';

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: FamilyMember;
  onSubmit: (data: Partial<FamilyMember>) => void;
  isEditing?: boolean;
  parentId?: string; // ID của cha/mẹ nếu thêm con
  spouseId?: string; // ID của người để thêm vợ/chồng
  relationType?: 'child' | 'spouse'; // Loại quan hệ khi thêm
}

export function MemberFormDialog({ 
  open, 
  onOpenChange, 
  member, 
  onSubmit, 
  isEditing = false,
  parentId,
  spouseId,
  relationType
}: MemberFormDialogProps) {
  const [formData, setFormData] = useState<Partial<FamilyMember>>(
    member || {
      fullName: '',
      birthDate: '',
      gender: 'male',
      generation: 1,
      address: '',
      occupation: '',
      description: '',
      phone: '',
      email: ''
    }
  );

  const [openFatherSelect, setOpenFatherSelect] = useState(false);
  const [openMotherSelect, setOpenMotherSelect] = useState(false);
  const [openSpouseSelect, setOpenSpouseSelect] = useState(false);

  // Khi dialog mở, cập nhật form data dựa trên relationType
  useEffect(() => {
    if (open && !isEditing) {
      let newFormData = {
        fullName: '',
        birthDate: '',
        gender: 'male',
        generation: 1,
        address: '',
        occupation: '',
        description: '',
        phone: '',
        email: ''
      };

      if (relationType === 'child' && parentId) {
        const parent = getFamilyMemberById(parentId);
        if (parent) {
          newFormData.generation = parent.generation + 1;
          // Nếu parent là nam thì set làm cha, nếu nữ thì set làm mẹ
          if (parent.gender === 'male') {
            newFormData.fatherId = parentId;
          } else {
            newFormData.motherId = parentId;
          }
        }
      } else if (relationType === 'spouse' && spouseId) {
        const spouse = getFamilyMemberById(spouseId);
        if (spouse) {
          newFormData.generation = spouse.generation;
          newFormData.spouseIds = [spouseId];
        }
      }

      setFormData(newFormData);
    } else if (open && member) {
      setFormData(member);
    }
  }, [open, isEditing, relationType, parentId, spouseId, member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.birthDate || !formData.gender) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const dataToSubmit = {
      ...formData,
      id: member?.id || `member-${Date.now()}`,
    };

    onSubmit(dataToSubmit);
    onOpenChange(false);
  };

  const maleMembersList = mockFamilyMembers.filter(m => m.gender === 'male');
  const femaleMembersList = mockFamilyMembers.filter(m => m.gender === 'female');
  const allMembersList = mockFamilyMembers.filter(m => m.id !== formData.id);

  const selectedFather = formData.fatherId ? getFamilyMemberById(formData.fatherId) : null;
  const selectedMother = formData.motherId ? getFamilyMemberById(formData.motherId) : null;
  const selectedSpouses = formData.spouseIds?.map(id => getFamilyMemberById(id)).filter(Boolean) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa thành viên' : 
             relationType === 'child' ? 'Thêm con' :
             relationType === 'spouse' ? 'Thêm vợ/chồng' :
             'Thêm thành viên mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Cập nhật thông tin thành viên gia đình' 
              : relationType === 'child' ? `Thêm con cho ${getFamilyMemberById(parentId!)?.fullName}`
              : relationType === 'spouse' ? `Thêm vợ/chồng cho ${getFamilyMemberById(spouseId!)?.fullName}`
              : 'Thêm thành viên mới vào cây gia phả'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && relationType !== 'child' && relationType !== 'spouse' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="mb-3 text-sm">Quan hệ gia đình</h3>
              <div className="space-y-3">
                {/* Chọn cha */}
                <div className="space-y-2">
                  <Label>Cha</Label>
                  <Popover open={openFatherSelect} onOpenChange={setOpenFatherSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFatherSelect}
                        className="w-full justify-between"
                      >
                        {selectedFather ? selectedFather.fullName : "Chọn cha..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm..." />
                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setFormData({ ...formData, fatherId: undefined });
                              setOpenFatherSelect(false);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Không chọn
                          </CommandItem>
                          {maleMembersList.map((m) => (
                            <CommandItem
                              key={m.id}
                              value={m.fullName}
                              onSelect={() => {
                                setFormData({ 
                                  ...formData, 
                                  fatherId: m.id,
                                  generation: m.generation + 1
                                });
                                setOpenFatherSelect(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.fatherId === m.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {m.fullName} (Thế hệ {m.generation})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Chọn mẹ */}
                <div className="space-y-2">
                  <Label>Mẹ</Label>
                  <Popover open={openMotherSelect} onOpenChange={setOpenMotherSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMotherSelect}
                        className="w-full justify-between"
                      >
                        {selectedMother ? selectedMother.fullName : "Chọn mẹ..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm..." />
                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setFormData({ ...formData, motherId: undefined });
                              setOpenMotherSelect(false);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Không chọn
                          </CommandItem>
                          {femaleMembersList.map((m) => (
                            <CommandItem
                              key={m.id}
                              value={m.fullName}
                              onSelect={() => {
                                setFormData({ 
                                  ...formData, 
                                  motherId: m.id,
                                  generation: m.generation + 1
                                });
                                setOpenMotherSelect(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.motherId === m.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {m.fullName} (Thế hệ {m.generation})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Chọn vợ/chồng - Hỗ trợ nhiều người */}
                <div className="space-y-2">
                  <Label>Vợ/Chồng (có thể chọn nhiều)</Label>
                  <div className="space-y-2">
                    {selectedSpouses.map((spouse) => (
                      <div key={spouse?.id} className="flex items-center gap-2">
                        <Input 
                          value={`${spouse?.fullName} (${spouse?.gender === 'male' ? 'Nam' : 'Nữ'})`} 
                          disabled 
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              spouseIds: formData.spouseIds?.filter(id => id !== spouse?.id)
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Popover open={openSpouseSelect} onOpenChange={setOpenSpouseSelect}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          <span className="flex items-center gap-2">
                            {selectedSpouses.length > 0 && (
                              <Badge variant="secondary">{selectedSpouses.length}</Badge>
                            )}
                            Thêm vợ/chồng...
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Tìm kiếm..." />
                          <CommandEmpty>Không tìm thấy.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {allMembersList
                              .filter(m => !formData.spouseIds?.includes(m.id))
                              .map((m) => (
                                <CommandItem
                                  key={m.id}
                                  value={m.fullName}
                                  onSelect={() => {
                                    setFormData({
                                      ...formData,
                                      spouseIds: [...(formData.spouseIds || []), m.id]
                                    });
                                    setOpenSpouseSelect(false);
                                  }}
                                >
                                  {m.fullName} ({m.gender === 'male' ? 'Nam' : 'Nữ'}, Thế hệ {m.generation})
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính *</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value: 'male' | 'female' | 'other') => 
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Ngày sinh *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deathDate">Ngày mất</Label>
              <Input
                id="deathDate"
                type="date"
                value={formData.deathDate || ''}
                onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generation">Thế hệ *</Label>
              <Input
                id="generation"
                type="number"
                min="1"
                value={formData.generation}
                onChange={(e) => setFormData({ ...formData, generation: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Nghề nghiệp</Label>
              <Input
                id="occupation"
                value={formData.occupation || ''}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Kỹ sư, Bác sĩ..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Hà Nội, Việt Nam"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Thông tin thêm về thành viên..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

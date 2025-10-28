import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PendingChange, FamilyMember } from '../types/family';
import { getUserById, getFamilyMemberById, getRelationship } from '../data/mockData';
import { CheckCircle, XCircle, Clock, User, Edit, Plus, Trash, Eye, Calendar, MapPin, Briefcase, Mail, Phone, Heart, Users } from 'lucide-react';
import { toast } from 'sonner';

interface PendingChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changes: PendingChange[];
  onApprove: (changeId: string) => void;
  onReject: (changeId: string, reason: string) => void;
}

export function PendingChangesDialog({ 
  open, 
  onOpenChange, 
  changes, 
  onApprove, 
  onReject 
}: PendingChangesDialogProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewingMember, setViewingMember] = useState<Partial<FamilyMember> | null>(null);
  const [viewingChange, setViewingChange] = useState<PendingChange | null>(null);

  const handleReject = (changeId: string) => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    onReject(changeId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'add': return <Plus className="h-4 w-4" />;
      case 'edit': return <Edit className="h-4 w-4" />;
      case 'delete': return <Trash className="h-4 w-4" />;
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case 'add': return 'Thêm mới';
      case 'edit': return 'Chỉnh sửa';
      case 'delete': return 'Xóa';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Yêu cầu chờ duyệt ({changes.length})
          </DialogTitle>
          <DialogDescription>
            Xem xét và phê duyệt các thay đổi từ thành viên
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {changes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có yêu cầu nào đang chờ duyệt
            </div>
          ) : (
            changes.map((change) => {
              const submitter = getUserById(change.submittedBy);
              const isRejecting = rejectingId === change.id;

              return (
                <Card key={change.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1">
                            {getChangeTypeIcon(change.type)}
                            {getChangeTypeLabel(change.type)}
                          </Badge>
                          <CardTitle className="text-base">
                            {change.data.fullName}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-3 w-3" />
                          <span>Bởi {submitter?.name}</span>
                          <span>•</span>
                          <span>{new Date(change.submittedAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {change.type === 'edit' && change.originalData && (
                        <div>
                          <p className="text-gray-500 mb-2">Dữ liệu hiện tại:</p>
                          <div className="bg-gray-50 p-3 rounded space-y-1">
                            <p><strong>Họ tên:</strong> {change.originalData.fullName}</p>
                            <p><strong>Nghề nghiệp:</strong> {change.originalData.occupation}</p>
                            <p><strong>Địa chỉ:</strong> {change.originalData.address}</p>
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-gray-500">
                            {change.type === 'edit' ? 'Dữ liệu mới:' : 'Thông tin:'}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setViewingMember(change.data);
                              setViewingChange(change);
                            }}
                            className="text-xs gap-1 h-7"
                          >
                            <Eye className="h-3 w-3" />
                            Xem đầy đủ
                          </Button>
                        </div>
                        <div className="bg-blue-50 p-3 rounded space-y-1">
                          <p><strong>Họ tên:</strong> {change.data.fullName}</p>
                          {change.data.occupation && (
                            <p><strong>Nghề nghiệp:</strong> {change.data.occupation}</p>
                          )}
                          {change.data.address && (
                            <p><strong>Địa chỉ:</strong> {change.data.address}</p>
                          )}
                          {change.data.phone && (
                            <p><strong>SĐT:</strong> {change.data.phone}</p>
                          )}
                          {change.data.email && (
                            <p><strong>Email:</strong> {change.data.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {isRejecting ? (
                      <div className="space-y-3 pt-3 border-t">
                        <Label htmlFor={`reason-${change.id}`}>Lý do từ chối:</Label>
                        <Textarea
                          id={`reason-${change.id}`}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Nhập lý do từ chối..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(change.id)}
                          >
                            Xác nhận từ chối
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason('');
                            }}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          onClick={() => onApprove(change.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Phê duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRejectingId(change.id)}
                          className="gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>

      {/* Sheet để xem chi tiết thành viên */}
      <Sheet open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {viewingMember && viewingChange && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  Thông tin chi tiết - {viewingMember.fullName}
                  <Badge variant="secondary" className="gap-1">
                    {getChangeTypeIcon(viewingChange.type)}
                    {getChangeTypeLabel(viewingChange.type)}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Yêu cầu bởi {getUserById(viewingChange.submittedBy)?.name}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Avatar & Thông tin cơ bản */}
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={viewingMember.avatar} alt={viewingMember.fullName} />
                    <AvatarFallback>
                      {viewingMember.fullName?.split(' ').slice(-2).map(w => w[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3>{viewingMember.fullName}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">
                        {viewingMember.gender === 'male' ? 'Nam' : viewingMember.gender === 'female' ? 'Nữ' : 'Khác'}
                      </Badge>
                      {viewingMember.generation && (
                        <Badge variant="outline">Thế hệ {viewingMember.generation}</Badge>
                      )}
                      {viewingMember.deathDate && (
                        <Badge variant="secondary">Đã mất</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thông tin cá nhân */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {viewingMember.birthDate && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Ngày sinh
                        </div>
                        <p className="text-sm">{new Date(viewingMember.birthDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                    )}
                    {viewingMember.deathDate && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Ngày mất
                        </div>
                        <p className="text-sm">{new Date(viewingMember.deathDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                    )}
                    {viewingMember.address && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          Địa chỉ
                        </div>
                        <p className="text-sm">{viewingMember.address}</p>
                      </div>
                    )}
                    {viewingMember.occupation && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Briefcase className="h-3 w-3" />
                          Nghề nghiệp
                        </div>
                        <p className="text-sm">{viewingMember.occupation}</p>
                      </div>
                    )}
                    {viewingMember.phone && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          Số điện thoại
                        </div>
                        <p className="text-sm">{viewingMember.phone}</p>
                      </div>
                    )}
                    {viewingMember.email && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          Email
                        </div>
                        <p className="text-sm">{viewingMember.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Đặc điểm */}
                {viewingMember.characteristics && viewingMember.characteristics.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-4 w-4" />
                      <h3>Đặc điểm</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {viewingMember.characteristics.map((char, index) => (
                        <Badge key={index} variant="secondary">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mô tả */}
                {viewingMember.description && (
                  <div>
                    <h3 className="mb-2">Mô tả</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {viewingMember.description}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Quan hệ gia đình */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Quan hệ gia đình
                  </h3>
                  <div className="space-y-3">
                    {/* Cha mẹ */}
                    {(viewingMember.fatherId || viewingMember.motherId) && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm mb-2">Cha mẹ:</p>
                        <div className="flex flex-wrap gap-2">
                          {viewingMember.fatherId && (() => {
                            const father = getFamilyMemberById(viewingMember.fatherId);
                            return father ? (
                              <Badge variant="outline" className="gap-1">
                                👨 {father.fullName}
                              </Badge>
                            ) : (
                              <Badge variant="outline">👨 Cha (ID: {viewingMember.fatherId})</Badge>
                            );
                          })()}
                          {viewingMember.motherId && (() => {
                            const mother = getFamilyMemberById(viewingMember.motherId);
                            return mother ? (
                              <Badge variant="outline" className="gap-1">
                                👩 {mother.fullName}
                              </Badge>
                            ) : (
                              <Badge variant="outline">👩 Mẹ (ID: {viewingMember.motherId})</Badge>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Vợ/Chồng */}
                    {viewingMember.spouseIds && viewingMember.spouseIds.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm mb-2">Vợ/Chồng ({viewingMember.spouseIds.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {viewingMember.spouseIds.map(spouseId => {
                            const spouse = getFamilyMemberById(spouseId);
                            return spouse ? (
                              <Badge key={spouseId} variant="outline" className="gap-1">
                                💑 {spouse.fullName} {spouse.deathDate && '✝'}
                              </Badge>
                            ) : (
                              <Badge key={spouseId} variant="outline">💑 ID: {spouseId}</Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Con cái */}
                    {viewingMember.childrenIds && viewingMember.childrenIds.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm mb-2">Con cái ({viewingMember.childrenIds.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {viewingMember.childrenIds.map(childId => {
                            const child = getFamilyMemberById(childId);
                            return child ? (
                              <Badge key={childId} variant="outline" className="gap-1">
                                👶 {child.fullName} {child.deathDate && '✝'}
                              </Badge>
                            ) : (
                              <Badge key={childId} variant="outline">👶 ID: {childId}</Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Anh chị em */}
                    {(viewingMember.fatherId || viewingMember.motherId) && (() => {
                      const siblings: FamilyMember[] = [];
                      const father = viewingMember.fatherId ? getFamilyMemberById(viewingMember.fatherId) : null;
                      const mother = viewingMember.motherId ? getFamilyMemberById(viewingMember.motherId) : null;
                      
                      const siblingIds = new Set<string>();
                      if (father?.childrenIds) {
                        father.childrenIds.forEach(id => {
                          if (id !== viewingMember.id) siblingIds.add(id);
                        });
                      }
                      if (mother?.childrenIds) {
                        mother.childrenIds.forEach(id => {
                          if (id !== viewingMember.id) siblingIds.add(id);
                        });
                      }

                      siblingIds.forEach(id => {
                        const sibling = getFamilyMemberById(id);
                        if (sibling) siblings.push(sibling);
                      });

                      return siblings.length > 0 ? (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm mb-2">Anh chị em ({siblings.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {siblings.map(sibling => (
                              <Badge key={sibling.id} variant="outline" className="gap-1">
                                {sibling.gender === 'male' ? '👦' : '👧'} {sibling.fullName} {sibling.deathDate && '✝'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      onApprove(viewingChange.id);
                      setViewingMember(null);
                    }}
                    className="gap-2 flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Phê duyệt
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setViewingMember(null);
                      setRejectingId(viewingChange.id);
                    }}
                    className="gap-2 flex-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Từ chối
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Dialog>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm">
      {children}
    </label>
  );
}

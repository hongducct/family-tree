import { FamilyMember } from '../types/family';
import { FamilyTreeNode } from './FamilyTreeNode';
import { getFamilyMemberById } from '../data/mockData';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface FamilyTreeViewProps {
  members: FamilyMember[];
  onSelectMember: (memberId: string) => void;
  selectedMemberId?: string;
  onAddChild?: (parentId: string) => void;
  onAddSpouse?: (memberId: string) => void;
  canEdit?: boolean;
}

interface TreeNode {
  member: FamilyMember;
  spouses: FamilyMember[];
  children: TreeNode[];
}

export function FamilyTreeView({ 
  members, 
  onSelectMember, 
  selectedMemberId,
  onAddChild,
  onAddSpouse,
  canEdit = false
}: FamilyTreeViewProps) {
  
  // Tìm các cặp vợ chồng đã được xử lý để tránh lặp
  const processedSpouses = new Set<string>();

  // Tìm root nodes (những người không có cha mẹ)
  const findRootNodes = (): TreeNode[] => {
    const roots: TreeNode[] = [];
    const processedMembers = new Set<string>();

    members.forEach(member => {
      // Chỉ xử lý nếu không có cha mẹ và chưa được xử lý
      if (!member.fatherId && !member.motherId && !processedMembers.has(member.id)) {
        processedMembers.add(member.id);
        
        // Tìm tất cả vợ/chồng
        const spouses: FamilyMember[] = [];
        if (member.spouseIds && member.spouseIds.length > 0) {
          member.spouseIds.forEach(spouseId => {
            const spouseMember = getFamilyMemberById(spouseId);
            if (spouseMember && !processedMembers.has(spouseMember.id)) {
              spouses.push(spouseMember);
              processedMembers.add(spouseMember.id);
              processedSpouses.add(spouseId);
            }
          });
        }

        roots.push({
          member,
          spouses,
          children: buildChildren(member, spouses)
        });
      }
    });

    return roots;
  };

  // Xây dựng cây con cho một nhóm gia đình
  const buildChildren = (parent: FamilyMember, parentSpouses: FamilyMember[]): TreeNode[] => {
    const childrenNodes: TreeNode[] = [];
    const processedChildren = new Set<string>();

    // Lấy tất cả con từ parent và các vợ/chồng
    const childrenIds = new Set<string>();
    if (parent.childrenIds) {
      parent.childrenIds.forEach(id => childrenIds.add(id));
    }
    parentSpouses.forEach(spouse => {
      if (spouse.childrenIds) {
        spouse.childrenIds.forEach(id => childrenIds.add(id));
      }
    });

    childrenIds.forEach(childId => {
      if (processedChildren.has(childId)) return;
      
      const child = getFamilyMemberById(childId);
      if (!child) return;

      processedChildren.add(childId);

      // Tìm tất cả vợ/chồng của con
      const childSpouses: FamilyMember[] = [];
      if (child.spouseIds && child.spouseIds.length > 0) {
        child.spouseIds.forEach(spouseId => {
          if (!processedSpouses.has(spouseId)) {
            const childSpouse = getFamilyMemberById(spouseId);
            if (childSpouse) {
              childSpouses.push(childSpouse);
              processedSpouses.add(spouseId);
              processedChildren.add(spouseId);
            }
          }
        });
      }

      childrenNodes.push({
        member: child,
        spouses: childSpouses,
        children: buildChildren(child, childSpouses)
      });
    });

    return childrenNodes;
  };

  // Render một node và con cái của nó (từ trên xuống)
  const renderTreeNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.member.id} className="flex flex-col items-center">
        {/* Node hiện tại (nhóm gia đình) */}
        <div className="relative">
          <FamilyTreeNode
            member={node.member}
            spouses={node.spouses}
            onSelectMember={onSelectMember}
            selectedMemberId={selectedMemberId}
            onAddChild={onAddChild}
            onAddSpouse={onAddSpouse}
            canEdit={canEdit}
          />
          
          {/* Đường kẻ nối xuống con */}
          {hasChildren && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-gray-300" />
          )}
        </div>

        {/* Con cái */}
        {hasChildren && (
          <div className="relative mt-12">
            {/* Đường ngang nối các con */}
            {node.children.length > 1 && (
              <div 
                className="absolute top-0 h-0.5 bg-gray-300"
                style={{
                  left: '50%',
                  right: '50%',
                  width: `${(node.children.length - 1) * 300 + 150}px`,
                  transform: 'translateX(-50%)'
                }}
              />
            )}
            
            {/* Render từng con */}
            <div className="flex gap-12 justify-center items-start">
              {node.children.map((childNode) => (
                <div key={childNode.member.id} className="relative">
                  {/* Đường kẻ từ đường ngang xuống mỗi con */}
                  {node.children.length > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-12 bg-gray-300" />
                  )}
                  {renderTreeNode(childNode, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const rootNodes = findRootNodes();

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-blue-50">
      <TransformWrapper
        initialScale={0.8}
        minScale={0.2}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: false }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => zoomIn()}
                className="h-9 w-9 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => zoomOut()}
                className="h-9 w-9 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resetTransform()}
                className="h-9 w-9 p-0"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Tree Content */}
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-full h-full flex items-start justify-center"
            >
              <div className="min-w-max p-12 py-20">
                {rootNodes.length > 0 ? (
                  <div className="flex gap-24 justify-center items-start">
                    {rootNodes.map(rootNode => (
                      <div key={rootNode.member.id}>
                        {renderTreeNode(rootNode)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    Không có dữ liệu gia phả
                  </div>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

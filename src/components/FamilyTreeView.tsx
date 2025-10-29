import { FamilyMember } from '../types/family';
import { FamilyTreeNode } from './FamilyTreeNode';
import { getFamilyMemberById } from '../data/mockData';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

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

  // Tìm root node duy nhất (người có generation thấp nhất)
  const findRootNode = (): TreeNode | null => {
    if (members.length === 0) return null;
    
    // Tìm người có generation thấp nhất
    const minGeneration = Math.min(...members.map(m => m.generation));
    const rootMember = members.find(m => m.generation === minGeneration);
    
    if (!rootMember) return null;
    
    const processedMembers = new Set<string>();
    processedMembers.add(rootMember.id);
    
    // Tìm tất cả vợ/chồng của root
    const spouses: FamilyMember[] = [];
    if (rootMember.spouseIds && rootMember.spouseIds.length > 0) {
      rootMember.spouseIds.forEach(spouseId => {
        const spouseMember = getFamilyMemberById(spouseId);
        if (spouseMember && !processedMembers.has(spouseMember.id)) {
          spouses.push(spouseMember);
          processedMembers.add(spouseMember.id);
          processedSpouses.add(spouseId);
        }
      });
    }

    return {
      member: rootMember,
      spouses,
      children: buildChildren(rootMember, spouses)
    };
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
          
          {/* Đường kẻ nối xuống con với mũi tên */}
          {hasChildren && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full z-10">
              <div className="w-0.5 h-8 bg-gray-600"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-gray-600"></div>
              </div>
            </div>
          )}
        </div>

        {/* Con cái */}
        {hasChildren && (
          <div className="relative mt-8">
            {/* Đường ngang nối các con */}
            {node.children.length > 1 && (
              <div 
                className="absolute top-0 h-0.5 bg-gray-600 z-10"
                style={{
                  left: '50%',
                  right: '50%',
                  width: `${(node.children.length - 1) * 200 + 100}px`,
                  transform: 'translateX(-50%)'
                }}
              />
            )}
            
            {/* Render từng con */}
            <div className="flex flex-wrap gap-4 md:gap-8 lg:gap-12 xl:gap-16 justify-center items-start">
              {node.children.map((childNode, index) => (
                <div key={childNode.member.id} className="relative">
                  {/* Đường kẻ từ đường ngang xuống mỗi con với mũi tên */}
                  {node.children.length > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-10">
                      <div className="w-0.5 h-8 bg-gray-600"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-gray-600"></div>
                      </div>
                    </div>
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

  const rootNode = findRootNode();

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-blue-50">
      <TransformWrapper
        initialScale={0.6}
        minScale={0.05}
        maxScale={10}
        centerOnInit={false}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: false }}
        panning={{ 
          velocityDisabled: true,
          disabled: false,
          limitToBounds: false
        }}
        initialPositionX={0}
        initialPositionY={0}
        limitToBounds={false}
        centerZoomedOut={false}
        pinch={{ disabled: false }}
        alignmentAnimation={{ disabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => zoomIn()}
                className="h-9 w-9 p-0"
                title="Phóng to"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => zoomOut()}
                className="h-9 w-9 p-0"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resetTransform()}
                className="h-9 w-9 p-0"
                title="Reset zoom"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => centerView()}
                className="h-9 w-9 p-0"
                title="Căn giữa"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Tree Content */}
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="min-w-max min-h-max"
            >
              <div className="p-4 md:p-8 lg:p-16 xl:p-32 min-w-max min-h-max relative">
                {rootNode ? (
                  <div className="flex justify-center items-start">
                    {renderTreeNode(rootNode)}
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

import { FamilyMember } from '../types/family';
import { FamilyTreeNode } from './FamilyTreeNode';
import { getFamilyMemberById } from '../data/mockData';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

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

  // Component con để đo vị trí và vẽ line động
  const ChildrenContainer = ({
    node,
    level,
    renderTreeNode,
  }: {
    node: TreeNode;
    level: number;
    renderTreeNode: (node: TreeNode, level: number) => JSX.Element;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [linePositions, setLinePositions] = useState<{
      parentX: number;
      startX: number;
      endX: number;
      childXs: number[];
    } | null>(null);
  
    useEffect(() => {
      const updatePositions = () => {
        const container = containerRef.current;
        if (!container) return;
  
        // LẤY CHỈ CÁC PHẦN TỬ CON TRỰC TIẾP (direct children)
        const directChildren = Array.from(container.children) as HTMLElement[];
  
        // Nếu số phần tử trực tiếp không khớp số node.children thì bỏ qua (chờ render xong)
        if (directChildren.length === 0 || directChildren.length !== node.children.length) return;
  
        // Tính tâm (center X) cho mỗi phần tử con — sử dụng offsetLeft / offsetWidth
        const childXs = directChildren.map((el) => el.offsetLeft + el.offsetWidth / 2);
  
        const startX = Math.min(...childXs);
        const endX = Math.max(...childXs);
  
        // parentX là tâm của container (vì parent được đặt ở giữa container)
        const parentX = container.offsetWidth / 2;
  
        setLinePositions({ parentX, startX, endX, childXs });
      };
  
      // ResizeObserver để cập nhật khi layout thay đổi
      const ro = new ResizeObserver(() => {
        // throttle bằng requestAnimationFrame
        requestAnimationFrame(updatePositions);
      });
  
      if (containerRef.current) ro.observe(containerRef.current);
  
      // Chạy lần đầu sau render (đặt 0 hoặc 50ms nếu cần)
      const timeout = setTimeout(() => {
        requestAnimationFrame(updatePositions);
      }, 20);
  
      return () => {
        clearTimeout(timeout);
        ro.disconnect();
      };
    }, [node.children.length]);
  
    const childrenCount = node.children.length;
  
    return (
      <div className="relative mt-[60px] w-full">
        <div
          ref={containerRef}
          className="flex justify-center items-start relative"
        >
          {node.children.map((childNode) => (
            <div
              key={childNode.member.id}
              data-child-node
              className="relative"
            >
              {renderTreeNode(childNode, level + 1)}
            </div>
          ))}
        </div>
  
        {linePositions && childrenCount > 0 && (
          <svg
            className="absolute left-0 top-0 z-20 pointer-events-none"
            style={{
              top: "-45px",
              left: "0px",
              width: "100%",
              height: "60px",
              overflow: "visible",
            }}
          >
            {childrenCount === 1 ? (
              <line
                x1={linePositions.childXs[0]}
                y1="0"
                x2={linePositions.childXs[0]}
                y2="60"
                stroke="#000000"
                strokeWidth="2"
              />
            ) : (
              <>
                <line
                  x1={linePositions.parentX}
                  y1="0"
                  x2={linePositions.parentX}
                  y2="30"
                  stroke="#000000"
                  strokeWidth="2"
                />
                <line
                  x1={linePositions.startX}
                  y1="30"
                  x2={linePositions.endX}
                  y2="30"
                  stroke="#000000"
                  strokeWidth="2"
                />
                {linePositions.childXs.map((x, i) => (
                  <line
                    key={i}
                    x1={x}
                    y1="30"
                    x2={x}
                    y2="60"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                ))}
              </>
            )}
          </svg>
        )}
      </div>
    );
  };
  

  // Render một node và con cái của nó (từ trên xuống)
  const renderTreeNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.member.id} className="flex flex-col items-center relative">
        {/* Node hiện tại (nhóm gia đình) */}
        <div className="relative z-30">
          <FamilyTreeNode
            member={node.member}
            spouses={node.spouses}
            onSelectMember={onSelectMember}
            selectedMemberId={selectedMemberId}
            onAddChild={onAddChild}
            onAddSpouse={onAddSpouse}
            canEdit={canEdit}
          />
        </div>

        {/* Con cái */}
        {hasChildren && (
          <ChildrenContainer 
            node={node} 
            level={level + 1}
            renderTreeNode={renderTreeNode}
          />
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
              <div className="p-[120px] min-w-max min-h-max relative">
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

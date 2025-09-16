import React, { useState, useEffect } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart'
import { COLORS } from '../../../constants/colors'
import { ShimmerText } from '../../../components/ui/Shimmer'
import { apiRequest } from '@/services'
import { MY_NETWORK } from '../../../../api/api-variable'
import { useAuth } from '@/context'


// Types for our data structure
interface TreeMember {
  memberId: number
  encryptedmemberId: string
  parentId: number | null
  otherInfo: string
  account_number: string | number
  business: string
  status?: number | string
}

interface TooltipData {
  id: number
  name: string
  join_on: string
  buss: string
  activated_on: string
  account_number: string | number
  business: string
  class: string
  ib_status: string
}

interface NetworkData {
  title: string
  gototop: boolean
  tree: TreeMember[]
  tooltip: TooltipData[]
}





// Helper function to get tooltip data for a member
const getTooltipData = (networkData: NetworkData | null, memberId: number): TooltipData | undefined => {
  return networkData?.tooltip.find(item => item.id === memberId)
}

// Shimmer Components for Tree Structure
const ShimmerMemberNode = () => (
  <div className={`border-2 rounded-xl p-4 ${COLORS.SHADOW} min-w-[220px] max-w-[280px] mx-auto bg-${COLORS.WHITE} border-${COLORS.BORDER}`}>
    <div className="text-center space-y-3">
      <ShimmerText width="80%" height={20} className="mx-auto" />
      <ShimmerText width="90%" height={14} className="mx-auto" />
      <div className="flex justify-between">
        <ShimmerText width="40%" height={12} />
        <ShimmerText width="40%" height={12} />
      </div>
      <ShimmerText width="60%" height={24} className="mx-auto rounded-full" />
      <ShimmerText width="50%" height={12} className="mx-auto" />
    </div>
  </div>
)

const ShimmerTreeStructure = ({ levels = 3, childrenPerLevel = 2 }: { levels?: number, childrenPerLevel?: number }) => {
  const renderLevel = (currentLevel: number, maxLevels: number): React.ReactNode => {
    if (currentLevel >= maxLevels) return null;

    return (
      <div className="flex justify-center items-start space-x-8">
        {Array.from({ length: childrenPerLevel }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <ShimmerMemberNode />
            {currentLevel < maxLevels - 1 && (
              <div className="mt-4 w-full flex justify-center">
                {renderLevel(currentLevel + 1, maxLevels)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-center">
        <ShimmerMemberNode />
      </div>
      {levels > 1 && (
        <div className="mt-8">
          {renderLevel(1, levels)}
        </div>
      )}
    </div>
  );
};

const ShimmerHeader = () => (
  <div className={`bg-${COLORS.WHITE} rounded-2xl ${COLORS.SHADOW} p-6 mb-6`}>
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="space-y-3">
        <ShimmerText width={300} height={32} />
        <ShimmerText width={250} height={16} />
      </div>
      <div className="flex gap-3">
        <ShimmerText width={120} height={40} className="rounded-xl" />
      </div>
    </div>
  </div>
);

const ShimmerBreadcrumb = () => (
  <div className={`bg-${COLORS.WHITE} rounded-xl ${COLORS.SHADOW} p-4 mb-6`}>
    <div className="flex items-center gap-2">
      <ShimmerText width={80} height={16} />
      <ShimmerText width={100} height={16} />
      <ShimmerText width={20} height={16} />
      <ShimmerText width={120} height={16} />
    </div>
  </div>
);

const ShimmerMemberDetails = () => (
  <div className={`bg-${COLORS.WHITE} rounded-xl ${COLORS.SHADOW} p-6 mb-6`}>
    <ShimmerText width={200} height={24} className="mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={`bg-${COLORS.SECONDARY_BG} rounded-lg p-4`}>
          <ShimmerText width="60%" height={14} className="mb-2" />
          <ShimmerText width="80%" height={16} />
        </div>
      ))}
    </div>
  </div>
);

// Component for individual node
const MemberNode = ({ 
  member, 
  onClick, 
  isSelected,
  networkData
}: { 
  member: TreeMember
  onClick?: (member: TreeMember) => void
  isSelected?: boolean
  networkData: NetworkData | null
}) => {
  const tooltipData = getTooltipData(networkData, member?.memberId)
  
  if (!member) return null;
  
  return (
    <div 
      className={` rounded-xl p-4 ${COLORS.SHADOW} hover:shadow-xl transition-all duration-300 min-w-[220px]
        max-w-[280px] mx-auto cursor-pointer transform hover:scale-105 ${
        isSelected 
          ? `bg-${COLORS.PRIMARY_BG_LIGHT} border-${COLORS.PRIMARY} ring-2 ring-${COLORS.PRIMARY} ring-opacity-30` 
          : `bg-${COLORS.WHITE} border-${COLORS.BORDER} hover:border-${COLORS.PRIMARY}`
      }`}
      onClick={() => onClick?.(member)}
    >
      <div className="text-center">
        <div className={`font-bold text-${COLORS.SECONDARY} mb-2 text-lg`}>
          {tooltipData?.name || `Member ${member.memberId}`}
          

        </div>
        
        <div className={`text-sm text-${COLORS.SECONDARY_TEXT} mb-3 truncate`} title={member.otherInfo}>
          {member.otherInfo}
        </div>
        <div className={`flex justify-between text-xs text-${COLORS.SECONDARY_TEXT} mb-3`}>
          <span className="font-medium">Acc: {member.account_number}</span>
          
          <span className="font-medium">Bus: {member.business}</span>
        </div>
        <div className="mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            tooltipData?.ib_status === 'IB' 
              ? `bg-${COLORS.PRIMARY} text-white` 
              : `bg-${COLORS.SECONDARY_TEXT} text-white`
          }`}>
            {tooltipData?.ib_status || 'Unknown'}
          </span>
          
        </div>
        {/* Status Badge */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            member.status === 1 || member.status === 'active' || member.status === 'Active'
              ? 'bg-green-100 text-green-800' 
              : member.status === 0 || member.status === 'inactive' || member.status === 'Inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {member.status === 1 || member.status === 'active' || member.status === 'Active' 
              ? 'ACTIVE' 
              : member.status === 0 || member.status === 'inactive' || member.status === 'Inactive'
              ? 'INACTIVE'
              : member.status || 'UNKNOWN'}
          </span>
        </div>
        {tooltipData && (
          <div className={`text-xs text-${COLORS.GRAY} mb-2`}>
            Joined: {tooltipData.join_on}
          </div>
        )}
        {isSelected && (
          <div className={`text-xs text-${COLORS.PRIMARY} font-bold mt-2 flex items-center justify-center gap-1`}>
            <span>←</span>
            <span>Selected Root</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to build tree structure
const buildTree = (members: TreeMember[], parentId: number | null = null): TreeMember[] => {
  return members.filter(member => member.parentId === parentId)
}

// Recursive component to render tree nodes
const TreeNodeRenderer = ({ 
  members, 
  parentId, 
  onNodeClick, 
  selectedMemberId,
  networkData
}: { 
  members: TreeMember[]
  parentId: number | null
  onNodeClick: (member: TreeMember) => void
  selectedMemberId: number | null
  networkData: NetworkData | null
}) => {
  const children = buildTree(members, parentId)
  
  if (children.length === 0) return null

  return (
    <>
      {children.map(member => (
        <TreeNode 
          key={member.memberId} 
          label={
            <MemberNode 
              member={member} 
              onClick={onNodeClick}
              isSelected={selectedMemberId === member.memberId}
              networkData={networkData}
            />
          }
        >
          <TreeNodeRenderer 
            members={members} 
            parentId={member.memberId}
            onNodeClick={onNodeClick}
            selectedMemberId={selectedMemberId}
            networkData={networkData}
          />
        </TreeNode>
      ))}
    </>
  )
}

const IBRequestTree = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null) // Initialize as null
  const [breadcrumb, setBreadcrumb] = useState<Array<{id: number, name: string}>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true) // Start with loading true
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const {token} = useAuth();

  const FetchNetwork =() => {
    setIsLoading(true);
    try {
      apiRequest({
        endpoint: MY_NETWORK,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: unknown) => {
        // The API returns data directly, not nested under 'data' property
        const networkResponse = response as NetworkData;
        console.log('Full API Response:', response);
       
        
        setNetworkData(networkResponse || null);
        if (networkResponse?.tree?.[0]) {
          console.log('Setting selected member ID to:', networkResponse.tree[0].memberId);
          setSelectedMemberId(networkResponse.tree[0].memberId);
        }
        setIsLoading(false);
      })
        .catch((error: Error) => {
          console.error('Failed to fetch user data:', error);
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setIsLoading(false);
    } 
  };

  useEffect(() => {
    FetchNetwork();
  }, []);

  // Get the selected member data
  const selectedMember = networkData?.tree?.find(member => member.memberId === selectedMemberId) || null
  const selectedTooltipData = selectedMemberId ? getTooltipData(networkData, selectedMemberId) : null
  
  // Debug logging
  console.log('Debug Info:', {
    selectedMemberId,
    networkDataExists: !!networkData,
    treeLength: networkData?.tree?.length,
    selectedMember,
    isLoading
  });

  // Handle node click - make it the new root
  const handleNodeClick = (member: TreeMember) => {
    setSelectedMemberId(member.memberId)
    
    // Update breadcrumb
    const memberTooltip = getTooltipData(networkData, member.memberId)
    const newBreadcrumb = [...breadcrumb, { id: member.memberId, name: memberTooltip?.name || `Member ${member.memberId}` }]
    setBreadcrumb(newBreadcrumb)
  }

  // Handle breadcrumb click - navigate back
  const handleBreadcrumbClick = (memberId: number) => {
    const memberIndex = breadcrumb.findIndex(item => item.id === memberId)
    setSelectedMemberId(memberId)
    setBreadcrumb(breadcrumb.slice(0, memberIndex + 1))
  }

  // Reset to original root
  const handleResetToRoot = () => {
    if (networkData?.tree?.[0]) {
      setSelectedMemberId(networkData.tree[0].memberId)
      setBreadcrumb([])
    }
  }

  // Get all descendants of the selected member
  const getDescendants = (parentId: number): TreeMember[] => {
    if (!networkData?.tree) return [];
    const directChildren = networkData.tree.filter(member => member.parentId === parentId)
    let allDescendants: TreeMember[] = [...directChildren]
    
    directChildren.forEach(child => {
      allDescendants = [...allDescendants, ...getDescendants(child.memberId)]
    })
    
    return allDescendants
  }

  // Get the filtered tree data (selected member + its descendants)
  const getFilteredTreeData = (): TreeMember[] => {
    if (!selectedMemberId || !networkData?.tree) return []
    
    const descendants = getDescendants(selectedMemberId)
    console.log('selectedMemberId:', selectedMemberId, 'descendants:', descendants);
    return selectedMember ? [selectedMember, ...descendants] : descendants
  }

  const filteredTreeData = getFilteredTreeData()

  // Show shimmer loading state
  if (isLoading) {
    return (
      <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen`}>
        <ShimmerHeader />
        <ShimmerBreadcrumb />
        <ShimmerMemberDetails />
        
        {/* Tree Container with Shimmer */}
        <div className={`bg-${COLORS.WHITE} rounded-2xl ${COLORS.SHADOW} p-6 overflow-auto`}>
          <div className="min-w-full" style={{ minHeight: '400px' }}>
            <ShimmerTreeStructure levels={3} childrenPerLevel={2} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen`}>
      {/* Header */}
      <div className={`bg-${COLORS.WHITE} rounded-2xl ${COLORS.SHADOW} p-6 mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>
              {networkData?.title}
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT}`}>
              Interactive Network Tree View
            </p>
          </div>
          


{/* 











          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleResetToRoot}
              className={`px-6 py-3 bg-${COLORS.PRIMARY} text-white rounded-xl hover:bg-${COLORS.PRIMARY_BG} transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              Reset to Root
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className={`bg-${COLORS.WHITE} rounded-xl ${COLORS.SHADOW} p-4 mb-6`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-${COLORS.SECONDARY_TEXT} font-medium`}>Navigation:</span>
            <button
              onClick={handleResetToRoot}
              className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY}/80 transition-colors`}
            >
              Root
            </button>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.id}>
                <span className={`text-${COLORS.GRAY}`}>›</span>
                <button
                  onClick={() => handleBreadcrumbClick(item.id)}
                  className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY}/80 transition-colors ${
                    index === breadcrumb.length - 1 ? 'font-semibold' : ''
                  }`}
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Selected Member Info */}
      {selectedTooltipData && (
        <div className={`bg-${COLORS.WHITE} rounded-xl ${COLORS.SHADOW} p-6 mb-6`}>
          <h2 className={`text-xl font-bold text-${COLORS.SECONDARY} mb-4`}>Selected Member Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`bg-${COLORS.SECONDARY_BG} rounded-lg p-4`}>
              <div className={`text-${COLORS.SECONDARY_TEXT} text-sm font-medium`}>Name</div>
              <div className={`text-${COLORS.SECONDARY} font-semibold`}>{selectedTooltipData.name}</div>
            </div>
            <div className={`bg-${COLORS.SECONDARY_BG} rounded-lg p-4`}>
              <div className={`text-${COLORS.SECONDARY_TEXT} text-sm font-medium`}>Status</div>
              <div className={`text-${COLORS.SECONDARY} font-semibold`}>{selectedTooltipData.ib_status}</div>
            </div>
            <div className={`bg-${COLORS.SECONDARY_BG} rounded-lg p-4`}>
              <div className={`text-${COLORS.SECONDARY_TEXT} text-sm font-medium`}>Join Date</div>
              <div className={`text-${COLORS.SECONDARY} font-semibold`}>{selectedTooltipData.join_on}</div>
            </div>
            <div className={`bg-${COLORS.SECONDARY_BG} rounded-lg p-4`}>
              <div className={`text-${COLORS.SECONDARY_TEXT} text-sm font-medium`}>Business</div>
              <div className={`text-${COLORS.SECONDARY} font-semibold`}>{selectedTooltipData.business}</div>
            </div>
          </div>
        </div>
      )}

 

{/* Tree Container */}
<div className={`bg-${COLORS.WHITE} rounded-2xl ${COLORS.SHADOW} p-6 overflow-auto`}>
  <div className="min-w-full" style={{ minHeight: '400px' }}>
    {selectedMember ? (
      <Tree
        lineWidth="2px"
        lineColor="#e5e7eb"
        lineBorderRadius="10px"
        label={
          <MemberNode 
            member={selectedMember} 
            onClick={handleNodeClick}
            isSelected={true}
            networkData={networkData}
          />
        }
      >
        <TreeNodeRenderer 
          members={filteredTreeData} 
          parentId={selectedMemberId}
          onNodeClick={handleNodeClick}
          selectedMemberId={selectedMemberId}
          networkData={networkData}
        />
      </Tree>
    ) : (
      <div className={`text-center py-12 text-${COLORS.SECONDARY_TEXT}`}>
        <div className="text-6xl mb-4">🌳</div>
        <div className="text-xl font-semibold mb-2">No Network Members</div>
        <div>This member has no descendants to display</div>
      </div>
    )}
  </div>
</div>


    </div>
  )
}

export default IBRequestTree
import React, { useState } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart'
import { COLORS } from '../../../constants/colors'
// import { apiRequest } from '@/services'
// import { MY_NETWORK } from '../../../../api/api-variable'
// import { useAuth } from '@/context'


// Types for our data structure
interface TreeMember {
  memberId: number
  encryptedmemberId: string
  parentId: number | null
  otherInfo: string
  account_number: string | number
  business: string
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


const networkData: NetworkData ={
    "title": "Network Tree",
    "gototop": false,
    "tree": [
        {
            "memberId": 1,
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IkJIdmRRMTJxSzZLQTBGZjkyZkpwblE9PSIsInZhbHVlIjoiU1R3VENQVnR6djRsQWp0WWxkUlNMZz09IiwibWFjIjoiMmM5YmQxNGQ2YzM0NTJlOGM5MDhlNzRhZDQ2MGJhOTljOGZiNGYzY2EwODRlNmMwYjY5MGRjNTE4ZDliNDZhNiIsInRhZyI6IiJ9",
            "parentId": null,
            "otherInfo": "billioninfotech@gmail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6Ikorbjk2YUQvY1RLMFFXZjZCaWRQbWc9PSIsInZhbHVlIjoidUpiNVJ5ZTVrVDNnVzBPV2Zlc2gvdz09IiwibWFjIjoiOGNiNTBmYmFiNjM3N2MzNzg4ZGY2YmVjODMwNjYzZjdhMjQzOTc3MjU1NGU3ZTllZjQ1OGQ1NTIwZThlYzFjNiIsInRhZyI6IiJ9",
            "memberId": 2,
            "parentId": 1,
            "otherInfo": "Test1.1@yopmail.com",
            "account_number": 22107,
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IkF5N2NtVmhod3Q1N01QOHdKZ1Rzdnc9PSIsInZhbHVlIjoicEd3YmpkMy9pUmVBdk9uMFFWd3dzQT09IiwibWFjIjoiYTI3N2QwNjcyMmE1YzdiODY1NTJkNjJhNjM3N2YzNzgyZjhhZTEzODEyZjkxMWRmNTZhNmQ0ZGJlNDdiODcxZSIsInRhZyI6IiJ9",
            "memberId": 7,
            "parentId": 1,
            "otherInfo": "test@mail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IkdDR0FocXFaYUQ0OGhXVHZ6RS9FaGc9PSIsInZhbHVlIjoiUTFtK1BYanA1N2xVRFhtTzEyVUQ1QT09IiwibWFjIjoiYTk3ZDI5MTY5MjdhM2I2MDhmZDYyMTYzZWU2Y2YzMDdmZWY5NTkwOGI3MjQzMzc1ZGU2Yjg5NWFiOGE3MTdmMyIsInRhZyI6IiJ9",
            "memberId": 8,
            "parentId": 1,
            "otherInfo": "karan@mail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IlJPcXRTQmROU0RpNXhpVFQvUnRWQ0E9PSIsInZhbHVlIjoiY0Nyd1BVb05ETFRRRDcyT2VDSzZxdz09IiwibWFjIjoiMzQ1Yjg3NjcyMGQ0MTFlMzAyOGQ4ODlmNThhZjdkMDZhMWE1YTExMzA2MjViNjZlNDU0ZTUwMTJjZmZlNmZiZiIsInRhZyI6IiJ9",
            "memberId": 9,
            "parentId": 1,
            "otherInfo": "karan12@mail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IlBmM2YwUEZTWG5VbWVnM2pwbXE4TWc9PSIsInZhbHVlIjoiVnFXZ3Fnd0JveHp2RTY4S0Q5SDMvUT09IiwibWFjIjoiNzRmMjgzNGRkNjNhNDM1NDc2YjBkZDY1Y2U4YWI4ZThiYTU1YjIwNDQxMjM5MTUxMjI4MjViZjM4Nzc5ZDNmOSIsInRhZyI6IiJ9",
            "memberId": 10,
            "parentId": 1,
            "otherInfo": "guri@mail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IjZ6eFJBQlhLaFEybmUvMWMzZkViV0E9PSIsInZhbHVlIjoiL29FK01ZbFVrd1RLM3d6TGpkcTRKQT09IiwibWFjIjoiMzdiZGJhMjcxMDVlZGE3ZjZhYjZhYjFmMmUwODdmZDk2MmQxOGM4YzdiZmQxNDdiZjU5NjBlMmIyYzYzM2Q2MiIsInRhZyI6IiJ9",
            "memberId": 19,
            "parentId": 1,
            "otherInfo": "testfromapi@gmail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6Im5yVzJnY3ZOeUIxVW9xbjExVE1uMVE9PSIsInZhbHVlIjoibzdlaEJ2MFM3RkdRRVVtbTJMK002Zz09IiwibWFjIjoiZWFkOTdhZjExZTdmZWVmNDllODg5ZmVmOTdmMDllNjIxNjQzOTQ4MDI5MmVjMDlhNmVlNzFhMjFkMzYyNDFlMiIsInRhZyI6IiJ9",
            "memberId": 3,
            "parentId": 2,
            "otherInfo": "Test1.2@yopmail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IlNmUS9BS29QRnd0SUtRdUhEdWJkeUE9PSIsInZhbHVlIjoiQmhSQmh4QmJSeXEvM243VjJ0WnZVdz09IiwibWFjIjoiNDFiNWYyZDgzMjQzMzM0NWU1YmFlMzZhNjIxZjA2Mjg5NTQ0ZWM5NjdlZTU4OWQ2YWNlNTMwNDhjMzM0ZWQwOCIsInRhZyI6IiJ9",
            "memberId": 4,
            "parentId": 3,
            "otherInfo": "Test1.3@yopmail.com",
            "account_number": "N.A.",
            "business": "0.000"
        },
        {
            "encryptedmemberId": "https://crmdemo.test/network-tree/eyJpdiI6IkFQNVI4Z0ovVXg4S00wMUNUcEUvckE9PSIsInZhbHVlIjoiN3poalhzQWlXaWVRaTJrb3hYU2t5QT09IiwibWFjIjoiNzgzN2Q2YzY1Y2ZjMWEzNmY0MTExMDA5MDA0N2RhMWI4MzA4M2JmZjAwOWU1YTc2MDY5ZTA2MDAyMDIzNTZlOSIsInRhZyI6IiJ9",
            "memberId": 5,
            "parentId": 4,
            "otherInfo": "Test1.4@yopmail.com",
            "account_number": 22081,
            "business": "0.000"
        }
    ],
    "tooltip": [
        {
            "id": 1,
            "name": "Company  Horizon",
            "join_on": "2025-01-14",
            "buss": "0",
            "activated_on": "2025-01-14",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "IB"
        },
        {
            "id": 2,
            "name": "test  1",
            "join_on": "2025-02-12",
            "buss": "0",
            "activated_on": "2025-02-12",
            "account_number": 22107,
            "business": "0.000",
            "class": "inactive",
            "ib_status": "IB"
        },
        {
            "id": 7,
            "name": "test test",
            "join_on": "2025-07-16",
            "buss": "0",
            "activated_on": "2025-07-16",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "Client"
        },
        {
            "id": 8,
            "name": "karan vir",
            "join_on": "2025-07-16",
            "buss": "0",
            "activated_on": "2025-07-16",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "Client"
        },
        {
            "id": 9,
            "name": "karan vir singh",
            "join_on": "2025-07-16",
            "buss": "0",
            "activated_on": "2025-07-16",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "Client"
        },
        {
            "id": 10,
            "name": "gurpreet gurpreet",
            "join_on": "2025-07-17",
            "buss": "0",
            "activated_on": "2025-07-17",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "IB"
        },
        {
            "id": 19,
            "name": "testfromapi ",
            "join_on": "2025-09-01",
            "buss": "0",
            "activated_on": "2025-09-01",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "Client"
        },
        {
            "id": 3,
            "name": "test  2",
            "join_on": "2025-02-12",
            "buss": "0",
            "activated_on": "2025-02-12",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "IB"
        },
        {
            "id": 4,
            "name": "test  3",
            "join_on": "2025-02-12",
            "buss": "0",
            "activated_on": "2025-02-12",
            "account_number": "N.A.",
            "business": "0.000",
            "class": "inactive",
            "ib_status": "IB"
        },
        {
            "id": 5,
            "name": "test  4",
            "join_on": "2025-02-12",
            "buss": "0",
            "activated_on": "2025-02-12",
            "account_number": 22081,
            "business": "0.000",
            "class": "inactive",
            "ib_status": "IB"
        }
    ]
}


// Helper function to get tooltip data for a member
const getTooltipData = (networkData: NetworkData | null, memberId: number): TooltipData | undefined => {
  return networkData?.tooltip.find(item => item.id === memberId)
}

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
      className={`border-2 rounded-xl p-4 ${COLORS.SHADOW} hover:shadow-xl transition-all duration-300 min-w-[220px]
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
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(1) // Initialize with root member ID
  const [breadcrumb, setBreadcrumb] = useState<Array<{id: number, name: string}>>([])
  // const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  // const {token} = useAuth();

  // const FetchNetwork = () => {
  //   try {
  //     apiRequest({
  //       endpoint: MY_NETWORK,
  //       method: 'POST',
  //       headers: { Authorization: `Bearer ${token}` },
  //     }).then((response: any) => {
  //       setNetworkData(response.data || null);
  //       if (response.data?.tree?.[0]) {
  //         setSelectedMemberId(response.data.tree[0].memberId);
  //       }
  //       console.log('Network Data:', response);
  //     })
  //       .catch((error: any) => {
  //         console.error('Failed to fetch user data:', error);
  //       });
  //   } catch (error) {
  //     console.error('Failed to fetch user data:', error);
  //   } 
  // }

  // useEffect(() => {
  //   FetchNetwork();
  // }, []);

  // Get the selected member data
  const selectedMember = networkData?.tree?.find(member => member.memberId === selectedMemberId) || null
  const selectedTooltipData = selectedMemberId ? getTooltipData(networkData, selectedMemberId) : null

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

  // Don't render until data is loaded
  // if (!networkData || !selectedMember) {
  //   return (
  //     <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen flex items-center justify-center`}>
  //       <div className={`text-${COLORS.SECONDARY_TEXT} text-lg`}>Loading network data...</div>
  //     </div>
  //   )
  // }

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
        <div className="min-w-full">
          {filteredTreeData.length > 0 && selectedMember ? (
            <Tree
              lineWidth={'2px'}
              lineColor={COLORS.BORDER}
              lineBorderRadius={'10px'}
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
                members={networkData?.tree ?? []} 
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
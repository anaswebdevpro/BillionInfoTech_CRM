

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
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

interface AccordionNode {
  member: TreeMember
  tooltip: TooltipData | undefined
  children: AccordionNode[]
  level: number
}


const networkData: NetworkData = {
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


const IBAccordian = () => {
  // const [networkData, setNetworkData] = useState<NetworkData | null>(null)
  const [accordionData, setAccordionData] = useState<AccordionNode[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  // const { token } = useAuth()

  // Fetch network data
  // const fetchNetwork = () => {
  //   try {
  //     apiRequest({
  //       endpoint: MY_NETWORK,
  //       method: 'POST',
  //       headers: { Authorization: `Bearer ${token}` },
  //     }).then((response: any) => {
  //       setNetworkData(response.data || null)
  //       console.log('Network Data:', response)
  //     }).catch((error: any) => {
  //       console.error('Failed to fetch network data:', error)
  //     })
  //   } catch (error) {
  //     console.error('Failed to fetch network data:', error)
  //   }
  // }
  // useEffect(() => {
  //   fetchNetwork()
  // },[] )

  // Build hierarchical accordion structure
  const buildAccordionStructure = (data: NetworkData): AccordionNode[] => {
    const memberMap = new Map<number, AccordionNode>()
    const rootNodes: AccordionNode[] = []

    // First pass: create all nodes
    data.tree.forEach(member => {
      const tooltip = data.tooltip.find(t => t.id === member.memberId)
      memberMap.set(member.memberId, {
        member,
        tooltip,
        children: [],
        level: 0
      })
    })

    // Second pass: build hierarchy and calculate levels
    data.tree.forEach(member => {
      const node = memberMap.get(member.memberId)!
      const parent = member.parentId ? memberMap.get(member.parentId) : null

      if (parent) {
        parent.children.push(node)
        node.level = parent.level + 1
      } else {
        rootNodes.push(node)
      }
    })

    return rootNodes
  }

  useEffect(() => {
    if (networkData) {
      const accordionStructure = buildAccordionStructure(networkData)
      setAccordionData(accordionStructure)
      // Auto-expand first level by default
      const firstLevelIds = accordionStructure.map(node => node.member.memberId)
      setExpandedNodes(new Set(firstLevelIds))
    }
  }, [networkData])

  // Toggle node expansion
  const toggleNode = (memberId: number) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId)
    } else {
      newExpanded.add(memberId)
    }
    setExpandedNodes(newExpanded)
  }

  // Render accordion node
  const renderAccordionNode = (node: AccordionNode): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.member.memberId)
    const hasChildren = node.children.length > 0

  return (
      <div key={node.member.memberId} className="mb-2">
        <div 
          className={`border rounded-lg ${COLORS.SHADOW} transition-all duration-300 hover:shadow-lg ${
            node.level === 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 
            node.level === 1 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
            'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200'
          }`}
        >
          {/* Node Header */}
          <div 
            className={`p-4 cursor-pointer flex items-center justify-between ${
              hasChildren ? 'hover:bg-opacity-80' : ''
            }`}
            onClick={() => hasChildren && toggleNode(node.member.memberId)}
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Level indicator */}
              <div className="flex space-x-1">
                {Array.from({ length: node.level }, (_, i) => (
                  <div key={i} className={`w-1 h-6 rounded ${
                    node.level === 0 ? 'bg-blue-400' :
                    node.level === 1 ? 'bg-green-400' :
                    'bg-purple-400'
                  }`} />
                ))}
              </div>

              {/* Expand/Collapse Icon */}
              {hasChildren && (
                <div className={`transform transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : 'rotate-0'
                }`}>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}

              {/* Member Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-semibold ${
                    node.level === 0 ? 'text-blue-800' :
                    node.level === 1 ? 'text-green-800' :
                    'text-purple-800'
                  }`}>
                    {node.tooltip?.name || `Member ${node.member.memberId}`}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    node.tooltip?.ib_status === 'IB' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {node.tooltip?.ib_status || 'Unknown'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{node.member.otherInfo}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{node.member.account_number}</div>
                  <div className="text-gray-500">Account</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{node.member.business}</div>
                  <div className="text-gray-500">Business</div>
                </div>
                {hasChildren && (
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{node.children.length}</div>
                    <div className="text-gray-500">Downline</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Node Details (Collapsible) */}
          {isExpanded && node.tooltip && (
            <div className="border-t bg-white bg-opacity-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-gray-500 text-xs font-medium">Join Date</div>
                  <div className="text-gray-800 font-semibold">{node.tooltip.join_on}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-gray-500 text-xs font-medium">Activated On</div>
                  <div className="text-gray-800 font-semibold">{node.tooltip.activated_on}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-gray-500 text-xs font-medium">Status Class</div>
                  <div className="text-gray-800 font-semibold capitalize">{node.tooltip.class}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-gray-500 text-xs font-medium">Business Volume</div>
                  <div className="text-gray-800 font-semibold">{node.tooltip.buss}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="ml-6 mt-2 space-y-2">
            {node.children.map(child => renderAccordionNode(child))}
          </div>
        )}
      </div>
    )
  }

  if (!networkData) {
    return (
      <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className={`text-${COLORS.SECONDARY_TEXT} text-lg`}>Loading network data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen`}>
      {/* Header */}
      <div className={`bg-${COLORS.WHITE} rounded-2xl ${COLORS.SHADOW} p-6 mb-6`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>
              {networkData.title} - Accordion View
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT}`}>
              Hierarchical Network Tree in Accordion Format
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const allIds = new Set<number>()
                const collectIds = (nodes: AccordionNode[]) => {
                  nodes.forEach(node => {
                    allIds.add(node.member.memberId)
                    collectIds(node.children)
                  })
                }
                collectIds(accordionData)
                setExpandedNodes(allIds)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

        {/* Summary Stats */}
      <div className={`bg-${COLORS.WHITE} rounded-xl ${COLORS.SHADOW} p-4 my-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{networkData.tree.length}</div>
            <div className="text-gray-600 text-sm">Total Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold bg- text-green-600">
              {networkData.tooltip.filter(t => t.ib_status === 'IB').length}
            </div>
            <div className="text-gray-600 text-sm">IB Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {networkData.tooltip.filter(t => t.ib_status === 'Client').length}
            </div>
            <div className="text-gray-600 text-sm">Client Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {expandedNodes.size}
            </div>
            <div className="text-gray-600 text-sm">Expanded Nodes</div>
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      <div className={`bg-${COLORS.WHITE} rounded-2xl ${COLORS.SHADOW} p-6`}>
        {accordionData.length > 0 ? (
          <div className="space-y-2">
            {accordionData.map(node => renderAccordionNode(node))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <div className={`text-xl font-semibold mb-2 text-${COLORS.SECONDARY}`}>No Network Data</div>
            <div className={`text-${COLORS.SECONDARY_TEXT}`}>No network members found to display</div>
          </div>
        )}
      </div>

    
    </div>
  )
}

export default IBAccordian
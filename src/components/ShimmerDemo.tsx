import React, { useState } from 'react';
import { 
  Shimmer, 
  ShimmerText, 
  ShimmerCircle, 
  ShimmerCard, 
  ShimmerButton, 
  ShimmerTable, 
  ShimmerList,
  ShimmerStatsCard,
  ShimmerChart,
  ShimmerDataTable
} from './ui/Shimmer';
import Card from './ui/Card';
import Button from './ui/Button';

/**
 * Demo component showcasing all shimmer effects
 * This component demonstrates the various shimmer loading states
 */
const ShimmerDemo: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const toggleLoading = () => {
    setLoading(!loading);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shimmer Effects Demo</h1>
        <Button onClick={toggleLoading}>
          {loading ? 'Show Content' : 'Show Shimmer'}
        </Button>
      </div>

      {/* Basic Shimmer Components */}
      <Card title="Basic Shimmer Components">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Text Shimmer</h3>
              <ShimmerText width="100%" height={20} />
              <ShimmerText width="80%" height={16} className="mt-2" />
              <ShimmerText width="60%" height={14} className="mt-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Circle Shimmer</h3>
              <div className="flex items-center space-x-4">
                <ShimmerCircle height={40} width={40} />
                <div className="flex-1">
                  <ShimmerText width="70%" height={16} />
                  <ShimmerText width="50%" height={12} className="mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <Card title="Stats Cards Shimmer">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ShimmerStatsCard key={index} />
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sample Stat</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">1,234</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <div className="h-6 w-6 bg-blue-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Data Table */}
      <Card title="Data Table Shimmer">
        {loading ? (
          <ShimmerDataTable rows={5} columns={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User {index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">user{index + 1}@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* List Shimmer */}
      <Card title="List Shimmer">
        {loading ? (
          <ShimmerList items={4} />
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Item {index + 1}</p>
                  <p className="text-sm text-gray-500">Description for item {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Chart Shimmer */}
      <Card title="Chart Shimmer">
        {loading ? (
          <ShimmerChart />
        ) : (
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart would be rendered here</p>
          </div>
        )}
      </Card>

      {/* Button Shimmer */}
      <Card title="Button Shimmer">
        <div className="flex space-x-4">
          {loading ? (
            <>
              <ShimmerButton width={120} height={40} />
              <ShimmerButton width={100} height={40} />
              <ShimmerButton width={80} height={40} />
            </>
          ) : (
            <>
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ShimmerDemo;

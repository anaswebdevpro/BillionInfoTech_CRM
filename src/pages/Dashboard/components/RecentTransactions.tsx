import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import type { DashboardData, RecentTransaction } from '../../../types';

interface RecentTransactionsProps {
  dashboardData: DashboardData | null;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ dashboardData }) => {
  const recentTransactions = dashboardData?.recent_transactions || [];
  
  return (
    <Card title="Recent Transactions" subtitle="Latest account activity">
      <div className="space-y-1 overflow-y-scroll max-h-[300px]">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction: RecentTransaction, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-1 border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-lg p-2 transition-all duration-200"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "Deposit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "credit" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.txn_type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(transaction.created_on).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No recent transactions
          </p>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;

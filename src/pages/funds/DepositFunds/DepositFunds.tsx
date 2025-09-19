import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, CreditCard } from 'lucide-react';

import Card from '../../../components/ui/Card';
import { COLORS } from '../../../constants/colors';
import { apiRequest } from '@/services';
import { DEPOSIT_METHODS } from '../../../../api/api-variable';
import { useAuth } from '@/context';
import { DepositMethodsResponse, UIDepositMethod } from '../../../types/deposit';

/**
 * Deposits page component
 * Shows three deposit method cards with gradients and recommended tags
 */
const DepositFunds: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [depositMethods, setDepositMethods] = useState<UIDepositMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get icon and gradient based on method name
  const getMethodConfig = (methodName: string) => {
    const name = methodName.toLowerCase();
    
    if (name.includes('bank')) {
      return {
        icon: Landmark,
        gradient: 'from-blue-500 to-blue-600',
        id: 'bank'
      };
    } else if (name.includes('trc20')) {
      return {
        icon: CreditCard,
        gradient: 'from-teal-500 to-teal-600',
        id: 'usdt-trc20'
      };
    } else if (name.includes('bep20')) {
      return {
        icon: CreditCard,
        gradient: 'from-purple-500 to-purple-600',
        id: 'usdt-bep20'
      };
    } else {
      return {
        icon: Landmark,
        gradient: 'from-gray-500 to-gray-600',
        id: 'default'
      };
    }
  };

  const fetchMethods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        endpoint: DEPOSIT_METHODS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }) as DepositMethodsResponse;

      if (response && response.response && response.deposit_methods) {
        // Transform API data to UI format
        const transformedMethods: UIDepositMethod[] = response.deposit_methods.map((method) => {
          const config = getMethodConfig(method.name);
          return {
            ...method,
            id: config.id,
            icon: config.icon,
            gradient: config.gradient
          };
        });
        
        setDepositMethods(transformedMethods);
        console.log('Deposit methods loaded:', response);
      }
    } catch (error) {
      console.error("Failed to fetch deposit methods:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const handleMethodClick = (methodId: string) => {
    // Navigate to the specific deposit method page
    switch (methodId) {
      case 'bank':
        navigate('/dashboard/funds/deposit/bank-transfer');
        break;
      case 'usdt-trc20':
        navigate('/dashboard/funds/deposit/usdt-trc20');
        break;
      case 'usdt-bep20':
        navigate('/dashboard/funds/deposit/usdt-bep20');
        break;
            default:
        navigate('/dashboard/funds/deposit');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`border-b border-${COLORS.BORDER} pb-5`}>
        <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>All Deposit Funds Methods</h1>
        <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
          All payment methods
        </p>
      </div>

      {/* Payment Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className={`text-${COLORS.SECONDARY_TEXT}`}>Loading deposit methods...</div>
          </div>
        ) : depositMethods.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className={`text-${COLORS.SECONDARY_TEXT}`}>No deposit methods available</div>
          </div>
        ) : (
          depositMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card 
                key={method.name} 
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleMethodClick(method.id)}
              >
                <div className={`relative bg-gradient-to-br ${method.gradient} rounded-lg p-6 text-white`}>
                  {/* Recommended Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                      {method.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-end mb-4">
                    <div className="w-16 h-16 bg-green-100 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Icon className="h-8 w-8 text-gray-500 " />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4">{method.name}</h3>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-80">Processing time:</span>
                      <span className="text-white font-medium">{method.processing_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-80">Fee:</span>
                      <span className="text-white font-medium">{method.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-80">Min. Deposit:</span>
                      <span className="text-white font-medium">{method.min_deposit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-80">Limits:</span>
                      <span className="text-white font-medium">{method.limits}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DepositFunds;

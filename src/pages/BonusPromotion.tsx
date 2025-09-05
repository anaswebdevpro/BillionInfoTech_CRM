import React, { useState, useEffect } from 'react';
import { Gift, TrendingUp, Users, Calendar, Star, Target, DollarSign, Repeat, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { COLORS } from '../constants/colors';
// import { apiRequest } from '../services';
import { useAuth } from '../context/AuthContext/AuthContext';
// import { FETCH_BONUS, CLAIM_BONUS } from '../../api/api-variable';
import Card from '../components/ui/Card';

interface Bonus {
  id: number;
  name: string;
  type: 'welcome' | 'deposit' | 'volume' | 'referral' | 'redeposit' | 'target';
  value: string;
  maxAmount: string;
  status: 'active' | 'claimed' | 'expired' | 'ineligible';
  description: string;
  requirements: string[];
  startDate: string;
  endDate: string;
  claimedAt?: string;
}

const BonusPromotion: React.FC = () => {
  const { token } = useAuth();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  // Mock data for demonstration - replace with API call
  const mockBonuses: Bonus[] = [
    {
      id: 1,
      name: 'Welcome Bonus',
      type: 'welcome',
      value: '100%',
      maxAmount: '$5,000',
      status: 'active',
      description: 'Get 100% bonus on your first deposit up to $5,000',
      requirements: ['First-time deposit', 'Minimum $100 deposit', 'Complete KYC verification'],
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 2,
      name: 'Deposit Bonus',
      type: 'deposit',
      value: '50%',
      maxAmount: '$2,500',
      status: 'active',
      description: 'Earn 50% bonus on every deposit you make',
      requirements: ['Minimum $200 deposit', 'Account verification required'],
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 3,
      name: 'Volume Bonus',
      type: 'volume',
      value: '25%',
      maxAmount: '$1,000',
      status: 'active',
      description: 'Trading volume bonus based on your monthly activity',
      requirements: ['Minimum $10,000 monthly volume', 'Active trading account'],
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 4,
      name: 'Referral Bonus',
      type: 'referral',
      value: '$100',
      maxAmount: '$500',
      status: 'claimed',
      description: 'Earn $100 for each successful referral',
      requirements: ['Referral must complete registration', 'Referral must make first deposit'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      claimedAt: '2024-01-15'
    },
    {
      id: 5,
      name: 'Redeposit Bonus',
      type: 'redeposit',
      value: '30%',
      maxAmount: '$1,500',
      status: 'active',
      description: 'Special bonus for returning customers',
      requirements: ['Previous account holder', 'Minimum $300 deposit', '30 days since last deposit'],
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 6,
      name: 'Target Bonus',
      type: 'target',
      value: '75%',
      maxAmount: '$3,000',
      status: 'ineligible',
      description: 'Achieve monthly targets to unlock this bonus',
      requirements: ['Complete monthly trading targets', 'Maintain account for 3 months'],
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  ];

  useEffect(() => {
    const fetchBonuses = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Use mock data for now - replace with actual API call
        // const response = await apiRequest({
        //   endpoint: FETCH_BONUS,
        //   method: 'GET',
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBonuses(mockBonuses);
      } catch (error) {
        console.error('Failed to fetch bonuses:', error);
        setBonuses(mockBonuses); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchBonuses();
  }, [token]);

  const handleClaimBonus = async (bonusId: number) => {
    if (!token) return;

    setClaiming(bonusId);
    try {
      // Replace with actual API call
      // await apiRequest({
      //   endpoint: CLAIM_BONUS,
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   data: { bonusId }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update bonus status
      setBonuses(prev => prev.map(bonus => 
        bonus.id === bonusId 
          ? { ...bonus, status: 'claimed' as const, claimedAt: new Date().toISOString() }
          : bonus
      ));
    } catch (error) {
      console.error('Failed to claim bonus:', error);
    } finally {
      setClaiming(null);
    }
  };

  const getBonusIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Gift className="h-6 w-6" />;
      case 'deposit': return <DollarSign className="h-6 w-6" />;
      case 'volume': return <TrendingUp className="h-6 w-6" />;
      case 'referral': return <Users className="h-6 w-6" />;
      case 'redeposit': return <Repeat className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4 text-green-600" />;
      case 'claimed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'expired': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'ineligible': return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'ineligible': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-purple-100 text-purple-800';
      case 'deposit': return 'bg-green-100 text-green-800';
      case 'volume': return 'bg-blue-100 text-blue-800';
      case 'referral': return 'bg-orange-100 text-orange-800';
      case 'redeposit': return 'bg-pink-100 text-pink-800';
      case 'target': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-28 w-28 border-b-2 border-${COLORS.PRIMARY}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>
          Bonus & Promotions
        </h1>
        <p className={`text-${COLORS.SECONDARY_TEXT} text-lg`}>
          Discover amazing bonuses and promotions to boost your trading
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Gift className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Available Bonuses</p>
              <p className="text-2xl font-bold text-gray-900">
                {bonuses.filter(b => b.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Claimed Bonuses</p>
              <p className="text-2xl font-bold text-gray-900">
                {bonuses.filter(b => b.status === 'claimed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">$15,000</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Promotions</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bonus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonuses.map((bonus) => (
          <Card key={bonus.id} className="relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getTypeColor(bonus.type).replace('text-', 'bg-').replace('800', '100')}`}>
                  {getBonusIcon(bonus.type)}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{bonus.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(bonus.type)}`}>
                    {bonus.type.charAt(0).toUpperCase() + bonus.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(bonus.status)}
                <span className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bonus.status)}`}>
                  {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">{bonus.value}</div>
              <div className="text-sm text-gray-500">Up to {bonus.maxAmount}</div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 text-center">{bonus.description}</p>

            {/* Requirements */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {bonus.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Validity Period */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{bonus.startDate} - {bonus.endDate}</span>
            </div>

            {/* Claim Button */}
            <div className="mt-auto">
              {bonus.status === 'active' ? (
                <button
                  onClick={() => handleClaimBonus(bonus.id)}
                  disabled={claiming === bonus.id}
                  className={`w-full bg-${COLORS.PRIMARY} text-${COLORS.WHITE} py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {claiming === bonus.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Claiming...
                    </>
                  ) : (
                    'Claim Bonus'
                  )}
                </button>
              ) : bonus.status === 'claimed' ? (
                <div className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-lg text-center">
                  Claimed {bonus.claimedAt && new Date(bonus.claimedAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center">
                  {bonus.status === 'expired' ? 'Expired' : 'Not Eligible'}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Important Information</h3>
            <p className="text-sm text-blue-800">
              All bonuses are subject to terms and conditions. Please read the bonus terms carefully before claiming. 
              Bonuses may have wagering requirements and withdrawal restrictions. Contact support if you have any questions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BonusPromotion;

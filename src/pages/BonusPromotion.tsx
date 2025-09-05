import React, { useState, useEffect, useCallback } from 'react';

import { COLORS } from '../constants/colors';
import { apiRequest } from '../services';
import { useAuth } from '../context/AuthContext/AuthContext';
import { FETCH_BONUS, CLAIM_BONUS } from '../../api/api-variable';


// Types
interface Bonus {
  id: number;
  title: string;
  slug: string;
  description: string;
  condition: string;
  icon: string;
  bonus_percent: string | null;
  max_bonus: string;
  type: 'welcome' | 'deposit' | 'volume' | 'referral' | 'redeposit' | 'target';
  is_active: number;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  status?: string;
  data?: {
    message?: string;
    error?: string;
  };
}

interface BonusResponse extends ApiResponse {
  title: string;
  bonuses: Bonus[];
}

type ClaimBonusResponse = ApiResponse;

// Removed BONUS_TYPES for simplified design

// Utility Functions
const extractErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'An unexpected error occurred. Please try again.';
  }

  // Check for axios error with response data
  if ('response' in error && error.response && typeof error.response === 'object') {
    const responseData = error.response as { 
      data?: { 
        message?: string; 
        error?: string;
        errors?: string | string[] | { [key: string]: string[] };
        detail?: string;
      } 
    };
    
    if (responseData.data?.message) return responseData.data.message;
    if (responseData.data?.error) return responseData.data.error;
    if (responseData.data?.detail) return responseData.data.detail;
    if (responseData.data?.errors) {
      if (typeof responseData.data.errors === 'string') return responseData.data.errors;
      if (Array.isArray(responseData.data.errors)) return responseData.data.errors.join(', ');
      if (typeof responseData.data.errors === 'object') {
        const errorValues = Object.values(responseData.data.errors).flat();
        return errorValues.join(', ');
      }
    }
  }
  
  // Check for direct error message
  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

const extractApiMessage = (response: ApiResponse | null): string => {
  if (!response) return 'Operation failed. Please try again.';
  return response.message || response.error || response.data?.message || response.data?.error || 'Operation failed. Please try again.';
};



const BonusCard: React.FC<{ 
  bonus: Bonus; 
  onClaim: (id: number) => void; 
  isClaiming: boolean; 
}> = ({ bonus, onClaim, isClaiming }) => {
  return (
    <div className={`bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-6 border-${COLORS.BORDER}`}>
      {/* Icon */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">
          {bonus.icon || '🎁'}
        </div>
        <h3 className={`text-lg font-bold text-${COLORS.SECONDARY}`}>{bonus.title}</h3>
      </div>

      {/* Description */}
      <p className={`text-${COLORS.SECONDARY_TEXT} text-center mb-4`}>{bonus.description}</p>

      {/* Condition */}
      <div className="text-center mb-4">
        <span className={`text-${COLORS.PRIMARY} text-sm font-medium`}>{bonus.condition}</span>
      </div>

      {/* Claim Button */}
      <button
        onClick={() => onClaim(bonus.id)}
        disabled={isClaiming || bonus.is_active !== 1}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          bonus.is_active === 1 && !isClaiming
            ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY} hover:text-${COLORS.WHITE}`
            : `bg-${COLORS.GRAY_LIGHT} text-${COLORS.GRAY} cursor-not-allowed`
        }`}
      >
        {isClaiming ? 'Claiming...' : 'Claim'}
      </button>
    </div>
  );
};

// Main Component
const BonusPromotion: React.FC = () => {
  const { token } = useAuth();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<number | null>(null);

  // API call functions
  const fetchBonuses = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching bonuses with token:', token.substring(0, 10) + '...');
      
      const response = await apiRequest<BonusResponse>({
        endpoint: FETCH_BONUS,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Fetch bonuses response:', response);
      
      if (response && response.success) {
        setBonuses(response.bonuses);
      } else {
        const errorMessage = extractApiMessage(response);
        console.error('Failed to fetch bonuses:', errorMessage);
      }
    } catch (error) {
      console.error('Failed to fetch bonuses:', error);
      const errorMessage = extractErrorMessage(error);
      console.error('Fetch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const claimBonus = async (bonusId: number) => {
    if (!token) return;

    setClaiming(bonusId);
    try {
      console.log('Claiming bonus with ID:', bonusId);
      
      const response = await apiRequest<ClaimBonusResponse>({
        endpoint: CLAIM_BONUS,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { bonus_id: bonusId },
      });
      
      console.log('Claim bonus response:', response);
      
             if (response) {
         if (response.success || response.status === 'success') {
           console.log('Bonus claimed successfully!');
         } else {
           const errorMessage = extractApiMessage(response);
           console.error('Claim failed:', errorMessage);
         }
       } else {
         console.error('Failed to claim bonus. Please try again.');
       }
     } catch (error) {
       console.error('Failed to claim bonus:', error);
       const errorMessage = extractErrorMessage(error);
       console.error('Claim error:', errorMessage);
    } finally {
      setClaiming(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-28 w-28 border-b-2 border-${COLORS.PRIMARY}`}></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>
          Bonus & Promotions
        </h1>
        <p className={`text-${COLORS.SECONDARY_TEXT}`}>
          Choose from our amazing bonus offers
        </p>
      </div>

     
     

      {/* Bonus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonuses.map((bonus) => (
          <BonusCard
            key={bonus.id}
            bonus={bonus}
            onClaim={claimBonus}
            isClaiming={claiming === bonus.id}
          />
        ))}
      </div>
    </div>
  );
};

export default BonusPromotion;
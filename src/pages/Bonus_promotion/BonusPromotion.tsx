import React, { useState, useEffect, useCallback } from 'react';

import { COLORS } from '../../constants/colors';
import { apiRequest } from '../../services';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { FETCH_BONUS, CLAIM_BONUS } from '../../../api/api-variable';
import { enqueueSnackbar } from 'notistack';
import { ShimmerText,  ShimmerButton } from '../../components/ui/Shimmer';


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

// Simplified API handling - removed complex error handling and types



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
            ? `bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-${COLORS.PRIMARY} hover:text-${COLORS.WHITE}`
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
  const FetchBonuses = useCallback(() => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: FETCH_BONUS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      
      .then((response: unknown) => {
        const data = response as { bonuses?: Bonus[]; success?: boolean };
        setLoading(false);
        setBonuses(data.bonuses || []);
        console.log('Bonuses Data:', response);
       
      }) 
        .catch((error: Error) => {
          setLoading(false);
          console.error('Failed to fetch bonuses:', error);
          enqueueSnackbar('Failed to fetch bonuses: ' + error.message, { variant: 'error' });
        });
    } catch (error) {
      setLoading(false);
      console.error('Failed to fetch bonuses:', error);
      enqueueSnackbar('Failed to fetch bonuses. Please try again.', { variant: 'error' });
    }
  }, [token]);
    
  const ClaimBonus = (bonusId: number) => {
    if (!token) return;

    setClaiming(bonusId);
    try {
      apiRequest({
        endpoint: CLAIM_BONUS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: { bonus_id: bonusId },
        }).then((response: unknown) => {
          const data = response as { success?: boolean; status?: string; message?: string };
          setClaiming(null);
          console.log('Claim Bonus Response:', response);
          if (data && (data.success || data.status === 'success')) {
            console.log('Bonus claimed successfully!');
            enqueueSnackbar(data.message || 'Bonus claimed successfully!', { variant: 'success' });
            // Optionally refresh the bonuses list
            FetchBonuses();
          } else {
            console.error('Failed to claim bonus:', response);
            enqueueSnackbar(data.message || 'Failed to claim bonus. Please try again.', { variant: 'error' });  
          }
        })
        .catch((error: Error) => {
          setClaiming(null);
          console.error('Failed to claim bonus:', error);
          enqueueSnackbar('Failed to claim bonus: ' + error.message, { variant: 'error' });
        });
    } catch (error) {
      setClaiming(null);
      console.error('Failed to claim bonus:', error);
      enqueueSnackbar('Failed to claim bonus. Please try again.', { variant: 'error' });
    }
  };

  // Effects
  useEffect(() => {
    FetchBonuses();
  }, [FetchBonuses]);

  // Loading state with shimmer effects
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Shimmer */}
        <div className="text-center mb-8">
          <ShimmerText width="300px" height={36} className="mx-auto mb-2" />
          <ShimmerText width="400px" height={20} className="mx-auto" />
        </div>

        {/* Bonus Grid Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-6 border-${COLORS.BORDER}`}>
              <div className="space-y-4">
                {/* Icon and Title Shimmer */}
                <div className="text-center mb-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-2"></div>
                  <ShimmerText width="150px" height={20} className="mx-auto" />
                </div>

                {/* Description Shimmer */}
                <div className="text-center mb-4">
                  <ShimmerText width="100%" height={16} className="mb-2" />
                  <ShimmerText width="80%" height={16} className="mx-auto" />
                </div>

                {/* Condition Shimmer */}
                <div className="text-center mb-4">
                  <ShimmerText width="120px" height={16} className="mx-auto" />
                </div>

                {/* Button Shimmer */}
                <ShimmerButton width="100%" height={40} />
              </div>
            </div>
          ))}
        </div>
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
            onClaim={ClaimBonus}
            isClaiming={claiming === bonus.id}
          />
        ))}
      </div>
    </div>
  );
};

export default BonusPromotion;
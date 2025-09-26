
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { ShimmerLoader } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { DEPOSIT_METHODS_TRC20 } from '../../../../../api/api-variable';
import { useAuth } from '@/context';
import { enqueueSnackbar } from 'notistack';
import HistoryTable from './HistoryTable';

// TypeScript interfaces
interface Currency {
  id: number;
  symbol: string;
}

interface TRC20Response {
  response: boolean;
  address: string;
  chain: string;
  currency: Currency;
  min_deposit: number;
  qrimage: string;
  title: string;
}


const TRC20: React.FC = () => {
  const { token } = useAuth();
  const [trc20Data, setTrc20Data] = useState<TRC20Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchTRC20Data = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        endpoint: DEPOSIT_METHODS_TRC20,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }) as TRC20Response;

      if (response && response.response) {
        setTrc20Data(response);
        console.log('TRC20 data loaded:', response);
      }
    } catch (error: unknown) {
      console.log('Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      // Type guard for axios error
      const isAxiosError = (err: unknown): err is { response?: { data?: { message?: string } } } => {
        return typeof err === 'object' && err !== null && 'response' in err;
      };
      
      const errorMessage = isAxiosError(error) 
        ? error.response?.data?.message || 'Failed to fetch TRC20 data!'
        : 'Failed to fetch TRC20 data!';
        
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setTrc20Data(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTRC20Data();
  }, [fetchTRC20Data]);


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <ShimmerLoader variant="form" width={800} height={600} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>
            {trc20Data ? trc20Data.title : 'USDT TRC20 Deposit'}
          </h1>
          <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
            {trc20Data ? `Deposit ${trc20Data.currency.symbol} using ${trc20Data.chain.toUpperCase()} network` : 'Deposit USDT using TRC20 network'}
          </p>
        </div>
      </div>

      {/* QR Code Section */}
      {trc20Data && (
        <Card>
          <div className="text-center py-8">
            {/* Network Badge */}
            <div className="inline-block mb-6">
              <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                {trc20Data.chain.toUpperCase()}
              </span>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>
                Your {trc20Data.currency.symbol} Wallet Address
              </h2>
              <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={trc20Data.qrimage} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
              <p className={`text-lg font-mono text-${COLORS.SECONDARY} break-all`}>
                {trc20Data.address}
              </p>
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-2`}>
                Note: This address is <strong>{trc20Data.chain.toUpperCase()}</strong> compliant
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={() => copyToClipboard(trc20Data.address)}
              className="mb-6"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Address'}
            </Button>

            {/* Warning Notes */}
            <div className="text-left max-w-md mx-auto space-y-2">
              <p className="text-red-600 text-sm">
                Note:- Scan above QR code to transfer funds to your Demo wallet.
              </p>
              <p className="text-red-600 text-sm">
                • Funds deposited less than Min. Deposit Limit i.e. {trc20Data.currency.symbol} {trc20Data.min_deposit} will not be considered & credited
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Deposit History Table */}
      <HistoryTable />
    </div>
  );
};

export default TRC20;
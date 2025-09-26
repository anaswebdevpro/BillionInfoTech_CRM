
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { DEPOSIT_METHODS_BEP20 } from '../../../../../api/api-variable';
import { useAuth } from '@/context';
import HistoryTable from '../TRC20/HistoryTable';

// TypeScript interfaces
interface Currency {
  id: number;
  symbol: string;
}

interface BEP20Response {
  response: boolean;
  address: string;
  chain: string;
  currency: Currency;
  min_deposit: number;
  qrimage: string;
  title: string;
}

const BEP20: React.FC = () => {
  const { token } = useAuth();
  const [bep20Data, setBep20Data] = useState<BEP20Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchBEP20Data = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        endpoint: DEPOSIT_METHODS_BEP20,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }) as BEP20Response;

      if (response && response.response) {
        setBep20Data(response);
        console.log('BEP20 data loaded:', response);
      }
    } catch (error) {
      console.error("Failed to fetch BEP20 data:", error);
      setBep20Data(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBEP20Data();
  }, [fetchBEP20Data]);


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
        <div className="text-center py-8">
          <div className={`text-${COLORS.SECONDARY_TEXT}`}>Loading BEP20 data...</div>
        </div>
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
            {bep20Data ? bep20Data.title : 'USDT BEP20 Deposit'}
          </h1>
          <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
            {bep20Data ? `Deposit ${bep20Data.currency.symbol} using ${bep20Data.chain.toUpperCase()} network` : 'Deposit USDT using BEP20 network'}
          </p>
        </div>
      </div>

      {/* QR Code Section */}
      {bep20Data && (
        <Card>
          <div className="text-center py-8">
            {/* Network Badge */}
            <div className="inline-block mb-6">
              <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                {bep20Data.chain.toUpperCase()}
              </span>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>
                Your {bep20Data.currency.symbol} Wallet Address
              </h2>
              <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={bep20Data.qrimage} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
              <p className={`text-lg font-mono text-${COLORS.SECONDARY} break-all`}>
                {bep20Data.address}
              </p>
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-2`}>
                Note: This address is <strong>{bep20Data.chain.toUpperCase()}</strong> compliant
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={() => copyToClipboard(bep20Data.address)}
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
                • Funds deposited less than Min. Deposit Limit i.e. {bep20Data.currency.symbol} {bep20Data.min_deposit} will not be considered & credited
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

export default BEP20;
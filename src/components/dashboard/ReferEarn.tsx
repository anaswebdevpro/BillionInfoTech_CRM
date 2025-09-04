import { Twitter, Facebook, Instagram, MessageCircle } from 'lucide-react';

interface ReferEarnProps {
  referralLink?: string;
}

const ReferEarn: React.FC<ReferEarnProps> = ({ referralLink }) => {
  const defaultReferralLink = "https://demo.newcmsdesign.com/referral/abc123";
  const displayLink = referralLink || defaultReferralLink;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayLink);
    // You could add a toast notification here
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Refer & Earn</h3>
          <p className="text-sm text-gray-600 mt-1">Share and get rewarded</p>
        </div>
        
        {/* Content with Scroll */}
        <div className="p-6 flex-1 overflow-auto">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-500">
              Invite your friends to join our platform and earn rewards for
              each successful referral.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={displayLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-blue-700 transition whitespace-nowrap"
                onClick={handleCopyLink}
              >
                Copy
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm flex-1 min-w-0">
                <Twitter size={16} />
                <span className="hidden sm:inline">Twitter</span>
              </button>

              <button className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm flex-1 min-w-0">
                <Facebook size={16} />
                <span className="hidden sm:inline">Facebook</span>
              </button>

              <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm flex-1 min-w-0">
                <Instagram size={16} />
                <span className="hidden sm:inline">Instagram</span>
              </button>

              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm flex-1 min-w-0">
                <MessageCircle size={16} />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferEarn;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { COLORS } from '../constants/colors';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-${COLORS.SECONDARY_BG} p-4`}>
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          {/* 404 Icon */}
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home size={20} />
              Go to Dashboard
            </Button>
            
            <Button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact our support team.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;

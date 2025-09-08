import React from 'react';
import { Settings as SettingsIcon, Users, HeadphonesIcon, CreditCard, FileText } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { COLORS } from '../../../constants/colors';

interface Department {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  responseTime: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DepartmentCardsProps {
  departments: Department[];
}

const DepartmentCards: React.FC<DepartmentCardsProps> = ({ departments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {departments.map((dept) => {
        const IconComponent = dept.icon;
        return (
          <Card key={dept.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${dept.status === 'online' ? 'bg-green-100' : 'bg-gray-100'}`}>
                <IconComponent className={`h-5 w-5 ${dept.status === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm text-${COLORS.SECONDARY} truncate`}>{dept.name}</h3>
                <p className={`text-xs text-${COLORS.SECONDARY_TEXT} mt-1 line-clamp-2`}>{dept.description}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${dept.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span className={`text-xs ${dept.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                    {dept.status === 'online' ? `Online • ${dept.responseTime}` : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DepartmentCards;

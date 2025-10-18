import { Card } from "@/components";
import { COLORS } from "@/constants";
import { AlertCircle, CheckCircle, Clock, Inbox, TrendingUp } from "lucide-react";

const HeaderState = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className={`p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-${COLORS.PRIMARY}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                89
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">
                  +42 today
                </span>
              </div>
            </div>
            <div className={`p-3 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-full`}>
              <Inbox className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                25
              </p>
              <div className="flex items-center mt-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="text-xs text-yellow-600">
                  Requires attention
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                12
              </p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-xs text-orange-600">Being resolved</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Resolved Today
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                10
              </p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">Great progress!</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>
  )
}

export default HeaderState
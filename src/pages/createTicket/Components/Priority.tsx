import { Card } from "@/components"
import { COLORS } from "@/constants"


const Priority = () => {
  return (
   
          <Card className="p-6">
            <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>Response Times</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Low Priority:</span>
                <span className="text-sm font-medium">24-48 hours</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Medium Priority:</span>
                <span className="text-sm font-medium">12-24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>High Priority:</span>
                <span className="text-sm font-medium">4-8 hours</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Urgent:</span>
                <span className="text-sm font-medium text-red-600">1-2 hours</span>
              </div>
            </div>
          </Card>
  )
}

export default Priority
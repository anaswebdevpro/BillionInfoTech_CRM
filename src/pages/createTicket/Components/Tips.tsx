import { Card } from '@/components'
import { COLORS } from '@/constants'


const Tips = () => {
  return (
<Card className="p-6">
            <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>Tips for Better Support</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full bg-${COLORS.PRIMARY} mt-2 flex-shrink-0`} />
                <p className={`text-${COLORS.SECONDARY_TEXT}`}>
                  Be specific about the issue you're experiencing
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full bg-${COLORS.PRIMARY} mt-2 flex-shrink-0`} />
                <p className={`text-${COLORS.SECONDARY_TEXT}`}>
                  Include screenshots or error messages when possible
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full bg-${COLORS.PRIMARY} mt-2 flex-shrink-0`} />
                <p className={`text-${COLORS.SECONDARY_TEXT}`}>
                  Mention what steps you've already tried
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full bg-${COLORS.PRIMARY} mt-2 flex-shrink-0`} />
                <p className={`text-${COLORS.SECONDARY_TEXT}`}>
                  Choose the correct department for faster resolution
                </p>
              </div>
            </div>
          </Card>
  )
}

export default Tips
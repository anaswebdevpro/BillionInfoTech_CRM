import { Card } from "@/components"

const EmergencyContact = () => {
  return (
     <Card className="p-6 bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Support</h3>
            <p className="text-sm text-red-600 mb-3">
              For critical security issues or urgent account problems, contact our emergency line:
            </p>
            <p className="text-lg font-bold text-red-800">+1 (555) 123-4567</p>
            <p className="text-xs text-red-600 mt-1">Available 24/7</p>
          </Card>
  )
}

export default EmergencyContact
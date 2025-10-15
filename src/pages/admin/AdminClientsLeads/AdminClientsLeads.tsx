import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";
import AllClientsTable from "./AllClientsTable";
import AddClientModal from "./AddClientModal";

const AdminClientsLeads: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    // Optionally refresh the client list here
    console.log("Client added successfully, refresh the list if needed");
  };

  if (loading) {
    return (
      <div className="p-6">
        <ShimmerLoader variant="dashboard" width={1000} height={600} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              All Clients
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage your clients and potential leads
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
          >
            <UserPlus className="h-4 w-4" />
            Add New Client
          </button>
        </div>
      </div>

     

      <AllClientsTable />

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AdminClientsLeads;

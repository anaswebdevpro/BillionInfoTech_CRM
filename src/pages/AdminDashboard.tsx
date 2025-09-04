import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import AdminSupport from './AdminSupport';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminSupport />
    </AdminLayout>
  );
};

export default AdminDashboard;

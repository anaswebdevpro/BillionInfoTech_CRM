import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

const AdminLayoutWrapper: React.FC = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

export default AdminLayoutWrapper;
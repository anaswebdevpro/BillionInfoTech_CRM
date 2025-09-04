import React from 'react';
import { useOutletContext, Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {  OutletContext} from '../types';



const DashboardLayoutWrapper: React.FC = () => {
  useOutletContext<OutletContext>();

  return (
  <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardLayoutWrapper;

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityHomeView } from './home/CommunityHomeView';
import { VolunteerHomeView } from './home/VolunteerHomeView';
import { AdminHomeView } from './home/AdminHomeView';

export const HomeScreen: React.FC = () => {
  const { userRole } = useApp();

  return (
    <div className="flex-1 w-full max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 space-y-4">
      {/* Render Role-Specific Divided Home Page */}
      {userRole === 'community' && <CommunityHomeView />}
      {userRole === 'volunteer' && <VolunteerHomeView />}
      {userRole === 'admin' && <AdminHomeView />}
    </div>
  );
};

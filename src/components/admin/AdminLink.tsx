
import React from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';

// This simple component will only render the Admin link if conditions are met
const AdminLink = () => {
  const { user } = useSupabase();
  
  // For now, we'll just check if a user is logged in
  // In a real app, you'd want to check for admin role
  if (!user) return null;
  
  return (
    <NavLink 
      to="/admin" 
      className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`
      }
    >
      <Shield className="mr-2 h-4 w-4" />
      Admin
    </NavLink>
  );
};

export default AdminLink;

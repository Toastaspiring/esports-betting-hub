
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Settings } from 'lucide-react';

interface AdminCardProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}

const AdminCard = ({ 
  title, 
  description, 
  icon,
  children
}: AdminCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'database':
        return <Database className="h-4 w-4 mr-2" />;
      case 'settings':
        return <Settings className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default AdminCard;

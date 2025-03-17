
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface AdminLinkProps {
  href: string;
  label: string;
}

const AdminLink = ({ href, label }: AdminLinkProps) => {
  return (
    <Button variant="outline" className="w-full justify-between" asChild>
      <Link to={href}>
        {label}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  );
};

export default AdminLink;

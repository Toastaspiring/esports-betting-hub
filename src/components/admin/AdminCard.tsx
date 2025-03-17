
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AdminCardProps {
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  onImport: () => Promise<any>;
  setImportResult: (result: any) => void;
}

const AdminCard = ({ 
  title, 
  description, 
  details, 
  icon, 
  onImport, 
  setImportResult 
}: AdminCardProps) => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);
      
      const result = await onImport();
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.data?.message || `Successfully imported ${title.toLowerCase()} from Liquipedia`,
        });
        setImportResult(result.data);
      } else {
        toast({
          title: "Import Failed",
          description: result.message || `Failed to import ${title.toLowerCase()} from Liquipedia`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error importing ${title.toLowerCase()}:`, error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{details}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              {icon}
              Import {title}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCard;

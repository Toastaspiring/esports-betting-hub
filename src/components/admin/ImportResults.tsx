
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ImportResultsProps {
  importStatus: Record<string, any>;
}

const ImportResults = ({ importStatus }: ImportResultsProps) => {
  if (!importStatus || Object.keys(importStatus).length === 0) return null;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Import Results</CardTitle>
        <CardDescription>
          Summary of the data import operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(importStatus).map(([type, status]: [string, any]) => (
            <div key={type} className="rounded-md bg-muted p-4">
              <p className="font-medium text-lg capitalize">{type}: {status.loading ? 'Importing...' : (status.success ? 'Success' : 'Failed')}</p>
              {status.message && <p className="text-sm text-muted-foreground mt-1">{status.message}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportResults;

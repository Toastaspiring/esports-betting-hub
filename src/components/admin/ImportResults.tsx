
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
  importResult: any;
}

const ImportResults = ({ importResult }: ImportResultsProps) => {
  if (!importResult) return null;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Import Results</CardTitle>
        <CardDescription>
          Summary of the last data import operation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-muted p-4">
          <p className="font-medium text-lg">{importResult.message}</p>
          
          {importResult.total !== undefined && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Items Imported</TableHead>
                    <TableHead>Items Skipped</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{importResult.total}</TableCell>
                    <TableCell>{importResult.imported}</TableCell>
                    <TableCell>{importResult.total - importResult.imported}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportResults;

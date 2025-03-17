
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Database, TrendingUp } from 'lucide-react';
import { 
  importLiquipediaMatches,
  importLiquipediaTeams,
  importLiquipediaTournaments,
  importLiquipediaPlayers
} from '@/services/supabaseService';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const Admin = () => {
  const { toast } = useToast();
  const [importingMatches, setImportingMatches] = useState(false);
  const [importingTeams, setImportingTeams] = useState(false);
  const [importingTournaments, setImportingTournaments] = useState(false);
  const [importingPlayers, setImportingPlayers] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleImportMatches = async () => {
    try {
      setImportingMatches(true);
      setImportResult(null);
      
      const result = await importLiquipediaMatches();
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.data?.message || "Successfully imported matches from Liquipedia",
        });
        setImportResult(result.data);
      } else {
        toast({
          title: "Import Failed",
          description: result.message || "Failed to import matches from Liquipedia",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing matches:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setImportingMatches(false);
    }
  };

  const handleImportTeams = async () => {
    try {
      setImportingTeams(true);
      setImportResult(null);
      
      const result = await importLiquipediaTeams();
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.data?.message || "Successfully imported teams from Liquipedia",
        });
        setImportResult(result.data);
      } else {
        toast({
          title: "Import Failed",
          description: result.message || "Failed to import teams from Liquipedia",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing teams:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setImportingTeams(false);
    }
  };

  const handleImportTournaments = async () => {
    try {
      setImportingTournaments(true);
      setImportResult(null);
      
      const result = await importLiquipediaTournaments();
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.data?.message || "Successfully imported tournaments from Liquipedia",
        });
        setImportResult(result.data);
      } else {
        toast({
          title: "Import Failed",
          description: result.message || "Failed to import tournaments from Liquipedia",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing tournaments:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setImportingTournaments(false);
    }
  };

  const handleImportPlayers = async () => {
    try {
      setImportingPlayers(true);
      setImportResult(null);
      
      const result = await importLiquipediaPlayers();
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.data?.message || "Successfully imported players from Liquipedia",
        });
        setImportResult(result.data);
      } else {
        toast({
          title: "Import Failed",
          description: result.message || "Failed to import players from Liquipedia",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing players:", error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setImportingPlayers(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Import data from Liquipedia to update your match database
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Matches</CardTitle>
                <CardDescription>
                  Import upcoming and ongoing matches from Liquipedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will fetch the latest match information and save it to your database.
                  New matches will be created with appropriate teams and tournaments.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleImportMatches} 
                  disabled={importingMatches}
                  className="w-full"
                >
                  {importingMatches ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import Matches
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Import Teams</CardTitle>
                <CardDescription>
                  Import team information from Liquipedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will fetch team information including logos, win rates, and region data.
                  Only new teams will be added to your database.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleImportTeams} 
                  disabled={importingTeams}
                  className="w-full"
                >
                  {importingTeams ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import Teams
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Import Tournaments</CardTitle>
                <CardDescription>
                  Import tournament and league information from Liquipedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will fetch information about leagues and tournaments including
                  logos, regions, and dates. Only new tournaments will be added.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleImportTournaments} 
                  disabled={importingTournaments}
                  className="w-full"
                >
                  {importingTournaments ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Import Tournaments
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Import Players</CardTitle>
                <CardDescription>
                  Import pro player information from Liquipedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will fetch professional player information including teams,
                  roles, and performance statistics. Only new players will be added.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleImportPlayers} 
                  disabled={importingPlayers}
                  className="w-full"
                >
                  {importingPlayers ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Import Players
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {importResult && (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;

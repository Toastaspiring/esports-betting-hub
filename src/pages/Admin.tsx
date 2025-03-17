
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Download, Database, TrendingUp } from 'lucide-react';
import { 
  importLiquipediaMatches,
  importLiquipediaTeams,
  importLiquipediaTournaments,
  importLiquipediaPlayers
} from '@/services/importService';
import AdminCard from '@/components/admin/AdminCard';
import ImportResults from '@/components/admin/ImportResults';

const Admin = () => {
  const [importResult, setImportResult] = useState<any>(null);

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
            <AdminCard
              title="Matches"
              description="Import upcoming and ongoing matches from Liquipedia"
              details="This will fetch the latest match information and save it to your database. New matches will be created with appropriate teams and tournaments."
              icon={<Download className="mr-2 h-4 w-4" />}
              onImport={importLiquipediaMatches}
              setImportResult={setImportResult}
            />
            
            <AdminCard
              title="Teams"
              description="Import team information from Liquipedia"
              details="This will fetch team information including logos, win rates, and region data. Only new teams will be added to your database."
              icon={<Download className="mr-2 h-4 w-4" />}
              onImport={importLiquipediaTeams}
              setImportResult={setImportResult}
            />
            
            <AdminCard
              title="Tournaments"
              description="Import tournament and league information from Liquipedia"
              details="This will fetch information about leagues and tournaments including logos, regions, and dates. Only new tournaments will be added."
              icon={<Database className="mr-2 h-4 w-4" />}
              onImport={importLiquipediaTournaments}
              setImportResult={setImportResult}
            />
            
            <AdminCard
              title="Players"
              description="Import pro player information from Liquipedia"
              details="This will fetch professional player information including teams, roles, and performance statistics. Only new players will be added."
              icon={<TrendingUp className="mr-2 h-4 w-4" />}
              onImport={importLiquipediaPlayers}
              setImportResult={setImportResult}
            />
          </div>
          
          <ImportResults importResult={importResult} />
        </div>
      </main>
    </div>
  );
};

export default Admin;


import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { seedDatabase } from "@/lib/seedDatabase";
import { useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminLink from "@/components/admin/AdminLink";
import ImportResults from "@/components/admin/ImportResults";
import ClearDatabaseButton from "@/components/admin/ClearDatabaseButton";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { importLiquipediaMatches, importLiquipediaTeams, importLiquipediaTournaments, importLiquipediaPlayers } from "@/services/supabaseService";

export default function Admin() {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { user } = useSupabase();

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleImport = async (type: string, importFunction: () => Promise<any>) => {
    setIsImporting(true);
    setImportStatus(prev => ({ ...prev, [type]: { loading: true } }));
    
    try {
      const result = await importFunction();
      setImportStatus(prev => ({ ...prev, [type]: { loading: false, success: result.success, message: result.message } }));
    } catch (error) {
      setImportStatus(prev => ({ ...prev, [type]: { loading: false, success: false, message: error.message } }));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <div className="container grid gap-6 px-4 md:px-6 max-w-6xl py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your esports betting platform data and settings.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AdminCard 
              title="Import Data"
              description="Import data from Liquipedia"
              icon="database"
            >
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleImport('tournaments', importLiquipediaTournaments)}
                  disabled={isImporting}
                >
                  Tournaments
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => handleImport('teams', importLiquipediaTeams)}
                  disabled={isImporting}
                >
                  Teams
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => handleImport('matches', importLiquipediaMatches)}
                  disabled={isImporting}
                >
                  Matches
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => handleImport('players', importLiquipediaPlayers)}
                  disabled={isImporting}
                >
                  Players
                </Button>
              </div>
              <ImportResults importStatus={importStatus} />
            </AdminCard>
            <AdminCard 
              title="Mock Data"
              description="Seed or clear mock data"
              icon="database"
            >
              <div className="grid gap-2">
                <Button 
                  className="w-full" 
                  onClick={() => seedDatabase()}
                >
                  Seed Database
                </Button>
                <ClearDatabaseButton />
              </div>
            </AdminCard>
            
            <AdminCard 
              title="Settings"
              description="Configure platform settings"
              icon="settings"
            >
              <div className="grid gap-2">
                <AdminLink href="/admin/leagues" label="Manage Leagues" />
                <AdminLink href="/admin/teams" label="Manage Teams" />
                <AdminLink href="/admin/matches" label="Manage Matches" />
                <AdminLink href="/admin/users" label="Manage Users" />
              </div>
            </AdminCard>
          </div>
        </div>
      </main>
    </div>
  );
}

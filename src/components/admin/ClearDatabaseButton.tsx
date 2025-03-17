
import { Button } from "@/components/ui/button";
import { clearDatabase } from "@/lib/clearDatabase";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ClearDatabaseButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClearDatabase = async () => {
    setIsLoading(true);
    try {
      await clearDatabase();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleClearDatabase}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Clearing...
        </>
      ) : (
        'Clear Database'
      )}
    </Button>
  );
};

export default ClearDatabaseButton;

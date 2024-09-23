import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex items-center mb-4">
        <p className="text-6xl font-bold border-r border-foreground/30 pr-6 mr-6">
          404
        </p>
        <div>
          <p className="text-xl font-normal">This page could not be found.</p>
        </div>
      </div>
      <Button 
        onClick={() => navigate(-1)}
        variant="default"
        className="mt-4"
      >
        Go Back
      </Button>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router";
import { Button, Card } from "@components/ui";
import { BadgeCheck } from "lucide-react";

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="bg-card border border-border p-8 md:p-10 relative overflow-hidden w-full max-w-lg">
        {/* Top Gradient Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 240, 255, 0) 0%, rgba(212, 160, 23, 0.5) 50%, rgba(0, 240, 255, 0) 100%)",
          }}
        />

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
            <BadgeCheck className="w-10 h-10 text-secondary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-white">
              Password Reset!
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your password has been successfully reset. You can now login with your new credentials.
            </p>
          </div>

          <Button
            className="w-full py-4 text-base font-semibold text-[#0B1220] mt-4"
            variant="secondary"
            onClick={() => navigate("/login")}
          >
            Continue to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SuccessScreen;

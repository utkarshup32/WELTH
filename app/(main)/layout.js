import React from "react";
import { AiCopilotDrawer } from "@/components/ai-copilot-drawer";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto my-32">
      {children}
      <AiCopilotDrawer />
    </div>
  );
};

export default MainLayout;

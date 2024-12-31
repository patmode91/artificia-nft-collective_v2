import React, { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import ContentPanel from "./dashboard/ContentPanel";

interface HomeProps {
  initialSection?: string;
}

const Home = ({ initialSection = "content-generation" }: HomeProps) => {
  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <ContentPanel activePanel={activeSection as any} />
    </div>
  );
};

export default Home;

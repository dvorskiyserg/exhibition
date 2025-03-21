import React from "react";
import { Panel, Placeholder } from "rsuite";

const Dashboard = () => {
  return (
    <Panel bordered header="Data Board">
      <Placeholder.Paragraph rows={8} />
    </Panel>
  );
};

export default Dashboard;

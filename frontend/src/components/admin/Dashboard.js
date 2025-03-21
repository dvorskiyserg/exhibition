import React from "react";
import AppLayout from "./AdminLayout";
import { Panel, Placeholder } from "rsuite";

const Dashboard = () => {
  return (
    <AppLayout>
      <h4>Огляд</h4>
      <Panel bordered>
        <Placeholder.Graph height={200} />
      </Panel>
    </AppLayout>
  );
};

export default Dashboard;

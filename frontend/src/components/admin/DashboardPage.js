import React from "react";
import AppLayout from "./AppLayout";
import { Panel, Placeholder } from "rsuite";

const DashboardPage = () => {
  return (
    <AppLayout>
      <h4>Огляд</h4>
      <Panel bordered>
        <Placeholder.Graph height={200} />
      </Panel>
    </AppLayout>
  );
};

export default DashboardPage;

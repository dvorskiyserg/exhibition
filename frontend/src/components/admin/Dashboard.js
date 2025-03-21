import React from "react";
import { Panel, Placeholder } from "rsuite";
import AdminLayout from "./AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <Panel bordered header="Панель адміністратора">
        <Placeholder.Paragraph rows={8} />
      </Panel>
    </AdminLayout>
  );
};

export default Dashboard;

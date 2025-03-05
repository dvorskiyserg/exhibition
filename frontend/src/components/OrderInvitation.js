import React from "react";
import { Button } from "rsuite";
import "../styles/orderInvitation.css"; // Додай стилі сюди

const OrderInvitation = () => {
  return (
    <div className="order-invitation-section">
      <div className="order-invitation-container">
        <h2>ЗАМОВИТИ ЗАПРОШЕННЯ</h2>
        <Button appearance="primary" className="order-button">
          ЗАМОВИТИ →
        </Button>
      </div>
    </div>
  );
};

export default OrderInvitation;

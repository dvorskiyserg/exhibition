import React from "react";
import { Button } from "rsuite";
import "../styles/callbackform.css";

const CallbackForm = () => {
  return (
    <div className="callback-form-section mx-auto p-6 px-4">
      <div className="callback-form-container">
        <h2>НАПИШІТЬ НАМ</h2>
        <Button appearance="primary" className="form-button">
          ЗВОРОТНИЙ ЗВ'ЯЗОК →
        </Button>
      </div>
    </div>
  );
};

export default CallbackForm;

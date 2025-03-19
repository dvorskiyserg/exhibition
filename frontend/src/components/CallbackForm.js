import React, { useState } from "react";
import { Button, Modal, Form, Input } from "rsuite";
import "../styles/callbackform.css";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const CallbackForm = () => {
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    console.log("Відправлені дані:", formValue);
    handleClose();
  };

  return (
    <div className="callback-form-section mx-auto p-6 px-4">
      <div className="callback-form-container">
        <h2>НАПИШІТЬ НАМ</h2>
        <Button
          appearance="primary"
          className="form-button"
          onClick={handleOpen}
        >
          ЗВОРОТНИЙ ЗВ'ЯЗОК
        </Button>
      </div>

      {/* Модальне вікно з формою */}
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>Форма зворотного зв’язку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormValue} formValue={formValue}>
            <Form.Group controlId="name">
              <Form.ControlLabel>Ваше ім’я</Form.ControlLabel>
              <Form.Control name="name" required />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" required />
            </Form.Group>
            <Form.Group controlId="message">
              <Form.ControlLabel>Повідомлення</Form.ControlLabel>
              <Form.Control
                rows={5}
                name="message"
                accepter={Textarea}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="first-btn"
            onClick={handleSubmit}
            appearance="primary"
          >
            Відправити
          </Button>
          <Button
            className="second-btn"
            onClick={handleClose}
            appearance="subtle"
          >
            Скасувати
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CallbackForm;

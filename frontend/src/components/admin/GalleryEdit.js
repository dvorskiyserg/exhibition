import React, { useState, useEffect } from "react";
import { Table, Button, Panel, Message, Input, Uploader } from "rsuite";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Galleryedit = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/gallery", {
        headers: { Authorization: `Bearer ${user.jwt}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => setError("Помилка завантаження галереї"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("name", eventName);
      formData.append("description", eventDescription);
      selectedImages.forEach((file) =>
        formData.append("images", file.blobFile)
      );

      await axios.post("http://localhost:1337/api/gallery", formData, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEventName("");
      setEventDescription("");
      setSelectedImages([]);
    } catch (error) {
      setError("Не вдалося додати подію");
    }
  };

  return (
    <Panel bordered header="Галерея">
      {error && <Message type="error">{error}</Message>}

      <Input
        placeholder="Назва події"
        value={eventName}
        onChange={setEventName}
        style={{ marginBottom: 10 }}
      />
      <Input
        as="textarea"
        placeholder="Опис події"
        value={eventDescription}
        onChange={setEventDescription}
        rows={3}
        style={{ marginBottom: 10 }}
      />

      <Uploader
        multiple
        autoUpload={false}
        fileList={selectedImages}
        onChange={setSelectedImages}
      />

      <Button
        appearance="primary"
        onClick={handleAddEvent}
        style={{ marginTop: 10 }}
      >
        Додати подію
      </Button>
    </Panel>
  );
};

export default Galleryedit;

import React from "react";
import { Container, FlexboxGrid, Panel } from "rsuite";
import PageTitle from "../components/PageTitle"; // Компонент для смужки заголовку
import bgImage from "../assets/header-bg.jpg"; // Фонове зображення для заголовка

const Contacts = () => {
  return (
    <>
      <PageTitle title="Контакти" backgroundImage={bgImage} />
      <FlexboxGrid
        justify="center"
        style={{ marginTop: "120px", marginBottom: "100px" }}
      >
        <Container style={{ maxWidth: "800px", textAlign: "center" }}>
          <Panel bordered style={{ padding: "30px" }}>
            <h3>Зв’яжіться з нами</h3>
            <p>
              <strong>Email:</strong> info@makosh-ethno.com
            </p>
            <p>
              <strong>Телефон:</strong> +380 (99) 123 45 67
            </p>
            <p>
              <strong>Адреса:</strong> Київ, Україна
            </p>
            <p>Будемо раді співпраці!</p>
          </Panel>
        </Container>
      </FlexboxGrid>
    </>
  );
};

export default Contacts;

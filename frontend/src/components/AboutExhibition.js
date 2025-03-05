import React from "react";
import { Panel } from "rsuite";

const AboutExhibition = () => {
  return (
    <div style={{ padding: "50px 0", backgroundColor: "#f8f8f8" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
      >
        <h2>ПРО ВИСТАВКУ</h2>
        <Panel
          bordered
          style={{
            textAlign: "left",
            backgroundColor: "#f8f8f8",
            padding: "30px",
            border: "0px",
          }}
        >
          <h4 className="AboutH4">MakoshEthno – з Україною в серці!</h4>
          <p>
            Міжнародна торговельна виставка InterBuildExpo є найпотужнішою
            будівельною подією України, яка щорічно збирає більше 1000 брендів
            та 30 тисяч відвідувачів. Виставка проходить з 1994 року і є
            найочікуванішим галузевим заходом.
          </p>
          <p>
            Сьогодні InterBuildExpo – це три павільйони експозицій, які
            охоплюють усі напрями будівництва, а також інтерактивні майданчики
            для проведення презентацій, майстер-класів, демонстрацій продукції
            та технологій.
          </p>
          <p>
            Щорічно наприкінці березня виставка на 4 дні стає центром
            будівельного життя України. Більше відео на сторінці у{" "}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            .
          </p>
          <a
            href="#details"
            style={{ color: "#f90", fontWeight: "bold", paddingTop: "10px" }}
          >
            Детальніше &gt;
          </a>
        </Panel>
      </div>
    </div>
  );
};

export default AboutExhibition;

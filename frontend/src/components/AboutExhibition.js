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
            MakoshEthno – це унікальна виставка українських товарів, яка щороку
            об’єднує найкращих виробників, майстрів та підприємців з усієї
            країни. Тут можна знайти ексклюзивні вироби народного промислу,
            сучасний етно-дизайн, натуральну косметику, органічні продукти,
            стильний одяг, аксесуари та багато іншого. Виставка створює
            платформу для знайомства з автентичною українською культурою, а
            також сприяє розвитку малого та середнього бізнесу. Гості можуть
            відвідати майстер-класи, продегустувати продукцію локальних брендів,
            поспілкуватися з виробниками та придбати якісні товари безпосередньо
            від виробників.
          </p>
          <p>
            Гості можуть відвідати майстер-класи, продегустувати продукцію
            локальних брендів, поспілкуватися з виробниками та придбати якісні
            товари безпосередньо від виробників.
          </p>
          <p>
            MakoshEthno – це місце, де традиції зустрічаються з сучасністю, а
            український креатив та підприємницький дух набувають нового
            звучання!{" "}
            <a
              href="https://www.instagram.com/makoshethno.oficial/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            .
          </p>
          <a
            href="#details"
            style={{ color: "#f90", fontWeight: "bold", marginTop: "20px" }}
          >
            Детальніше &gt;
          </a>
        </Panel>
      </div>
    </div>
  );
};

export default AboutExhibition;

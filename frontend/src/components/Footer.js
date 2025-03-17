import React from "react";
import { Button } from "rsuite";
import "../styles/footer.css"; // Додай стилі сюди
import logo from "../assets/logo.png"; // Лого виставки

const Footer = () => {
  return (
    <footer className="footer mx-auto p-6 px-4">
      <div className="footer-top mx-auto p-6 px-4">
        <div className="footer-info">
          <img src={logo} alt="InterBuildExpo" className="footer-logo" />
          <p>
            GENERAL ORGANIZER:{" "}
            <strong>KYIV INTERNATIONAL CONTRACT FAIR, LTD.</strong>
          </p>
          <p>
            Тел./факс: <br />
            +38 044 490 62 20 <br />
            +38 044 490 62 21
          </p>
          <p>
            E-mail: <a href="mailto:build@kmkya.kiev.ua">build@kmkya.kiev.ua</a>
          </p>
          <p>
            Фактична адреса:
            <br />
            Україна, м.Київ, вул. Багговутівська, 17-21, 4 поверх
            <br />
            Поштова адреса: Україна, м.Київ, а/с В-13 01001
          </p>
          <div className="social-icons">
            <a href="#">
              <i className="rs-icon rs-icon-facebook" />
            </a>
            <a href="#">
              <i className="rs-icon rs-icon-youtube" />
            </a>
            <a href="#">
              <i className="rs-icon rs-icon-instagram" />
            </a>
          </div>
          <Button appearance="primary" className="feedback-button">
            ФОРМА ЗВОРОТНЬОГО ЗВ'ЯЗКУ
          </Button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 KYIV INTERNATIONAL CONTRACT FAIR. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;

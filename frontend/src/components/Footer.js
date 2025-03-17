import React from "react";
import { Button } from "rsuite";
import "../styles/footer.css"; // Додай стилі сюди
import logo from "../assets/logo-mini.png"; // Лого виставки

const Footer = () => {
  return (
    <footer className="footer mx-auto p-6 px-4">
      <div className="footer-top mx-auto p-6 px-4">
        <div className="footer-info">
          <img src={logo} alt="InterBuildExpo" className="footer-logo" />
          <p>
            GENERAL ORGANIZER: <strong>MAKOSH ETHNO GROUP, LTD.</strong>
          </p>
          <p>
            Тел./факс: <br />
            +38 063 26 25 265 <br />
            +38 067 46 12 197
          </p>
          <p>
            E-mail: <a href="mailto:">info@makosh-ethno.com</a>
          </p>
          <p>
            Адреса:
            <br />
            Україна, м.Київ, вул. Хрещатик, 44а
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

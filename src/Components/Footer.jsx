import React from "react";
import "../Styles/Footer.css";
import { FaTelegramPlane, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3>Контакты</h3>
          <p><FaMapMarkerAlt /> г. Ташкент, ул. Примерная, 123</p>
          <p><FaPhoneAlt /> <a href="tel:+998901234567">+998 90 123 45 67</a></p>
          <p><FaEnvelope /> <a href="mailto:info@example.com">info@example.com</a></p>
        </div>

        <div className="footer-column">
          <h3>Социальные сети</h3>
          <div className="social-links">
            <a href="https://t.me/your_channel" target="_blank" rel="noreferrer"><FaTelegramPlane /></a>
            <a href="https://instagram.com/your_profile" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://wa.me/998901234567" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3>О нас</h3>
          <ul>
            <li><a href="/about">О компании</a></li>
            <li><a href="/terms">Условия использования</a></li>
            <li><a href="/contact">Связаться с нами</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Mki School. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;

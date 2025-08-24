import React from "react";
import "../Styles/Footer.css";
import { FaTelegramPlane, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <>
     <div className="test-mode-banner">Web site working in TEST MODE</div>
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3>О нас</h3>
          <ul>
            <li>
              Your premier destination for private English education. Enhance your language skills with our proven methods and interactive website. Learn effectively, communicate confidently, and achieve your goals.
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Социальные сети</h3>
          <div className="social-links">
            <a href="https://t.me/mkischool" target="_blank" rel="noreferrer"><FaTelegramPlane /></a>
            <a href="https://www.instagram.com/mki_school?igsh=YjFpOHA0NnA2NDRn" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Контакты</h3>
          <p><FaMapMarkerAlt /> г. Ташкент, ул. Примерная, 123</p>
          <p><FaPhoneAlt /> <a href="tel:+998901234567">+998 90 123 45 67</a></p>
          <p><FaEnvelope /> <a href="mailto:info@example.com">info@example.com</a></p>
        </div>





      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MKI School. Все права защищены.</p>
      </div>
    </footer>
    </>
  );
};

export default Footer;

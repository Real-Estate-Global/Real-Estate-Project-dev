// import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Лого и кратко описание */}
        <div className="footer-section">
          <h2 className="footer-logo">ИмотиБГ</h2>
          <p>Най-добрите оферти за недвижими имоти в България.</p>
        </div>

        {/* Бързи връзки */}
        <div className="footer-section">
          <h3>Бързи връзки</h3>
          <ul>
            <li><a href="/properties">Обяви</a></li>
            <li><a href="/about">За нас</a></li>
            <li><a href="/contact">Контакти</a></li>
            <li><a href="/blog">Блог</a></li>
          </ul>
        </div>

        {/* Контакти */}
        <div className="footer-section">
          <h3>Контакти</h3>
          <p>📍 София, България</p>
          <p>📞 +359 888 123 456</p>
          <p>✉️ info@imotibg.com</p>
        </div>

        {/* Социални мрежи */}
        <div className="footer-section social">
          <h3>Последвайте ни</h3>
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>

      {/* Авторски права */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ИмотиБГ. Всички права запазени.</p>
      </div>
    </footer>
  );
}

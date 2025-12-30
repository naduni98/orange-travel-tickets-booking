import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/PrivacyPolicy.css';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    const indexShapes = document.getElementById('indexShapes');
    const shapeCount = 20;
    const luxuryCount = 8;
    if (indexShapes) {
      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.className = 'index-shape';
        const size = Math.random() * 180 + 40;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${Math.random() * 35 + 25}s`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        shape.style.opacity = Math.random() * 0.25 + 0.05;
        shape.style.backdropFilter = `blur(${Math.random() * 10 + 5}px)`;
        indexShapes.appendChild(shape);
      }

      for (let i = 0; i < luxuryCount; i++) {
        const shape = document.createElement('div');
        shape.className = 'luxury-shape';
        const size = Math.random() * 300 + 100;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${Math.random() * 30 + 20}s`;
        shape.style.animationDelay = `${Math.random() * 3}s`;
        shape.style.opacity = Math.random() * 0.15 + 0.05;
        indexShapes.appendChild(shape);
      }
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const mobileHandler = () => {
      if (!navMenu || !mobileMenuBtn) return;
      navMenu.classList.toggle('active');
      mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    };
    mobileMenuBtn?.addEventListener('click', mobileHandler);

    const anchors = document.querySelectorAll('a[href^="#"]');
    const anchorHandlers = [];
    anchors.forEach(anchor => {
      const handler = (e) => {
        if (anchor.getAttribute('href') !== '#') {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      anchor.addEventListener('click', handler);
      anchorHandlers.push(() => anchor.removeEventListener('click', handler));
    });

    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        if (currentScroll > lastScroll) navbar.style.transform = 'translateY(-100%)';
        else navbar.style.transform = 'translateY(0)';
      } else navbar.style.transform = 'translateY(0)';
      lastScroll = currentScroll;
      const shapes = document.querySelector('.index-shapes');
      if (shapes) shapes.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
    };
    window.addEventListener('scroll', onScroll);

    const animatedElements = document.querySelectorAll('.privacy-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    const contactItems = document.querySelectorAll('.contact-item');
    const enter = (e) => { const icon = e.currentTarget.querySelector('i'); icon.style.transform = 'scale(1.2)'; };
    const leave = (e) => { const icon = e.currentTarget.querySelector('i'); icon.style.transform = 'scale(1)'; };
    contactItems.forEach(item => { item.addEventListener('mouseenter', enter); item.addEventListener('mouseleave', leave); });

    const style = document.createElement('style');
    style.textContent = `
      .privacy-section { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .contact-item i { transition: transform 0.3s ease; }
      .privacy-table tr { transition: background-color 0.3s ease; }
      .highlight-box { transform: translateY(20px); opacity: 0; animation: highlightFade 0.8s ease forwards; animation-delay: 0.3s; }
      @keyframes highlightFade { to { transform: translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      const shapes = document.querySelectorAll('.index-shape, .luxury-shape');
      shapes.forEach(shape => shape.style.animationPlayState = 'running');
    }, 100);

    return () => {
      mobileMenuBtn?.removeEventListener('click', mobileHandler);
      anchors.forEach((a, i) => anchorHandlers[i]());
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (indexShapes) while (indexShapes.firstChild) indexShapes.removeChild(indexShapes.firstChild);
      contactItems.forEach(item => { item.removeEventListener('mouseenter', enter); item.removeEventListener('mouseleave', leave); });
      style.remove();
    };
  }, []);

  return (
    <>
      <div className="bg-visual" />
      <div className="index-shapes" id="indexShapes" />

      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo"><span className="logo-icon"><i className="fas fa-shuttle-van" /></span><span>OrangeTravel</span></Link>
          <button className="mobile-menu-btn" id="mobileMenuBtn"><i className="fas fa-bars" /></button>
          <div className="nav-menu" id="navMenu">
            <Link to="/"> <i className="fas fa-home" /> Home</Link>
            <Link to="/seat-booking"><i className="fas fa-chair" /> Seat Booking</Link>
            <Link to="/contact-us"><i className="fas fa-phone-alt" /> Contact Us</Link>
            <Link to="/privacy-policy" className="active"><i className="fas fa-shield-alt" /> Privacy Policy</Link>
            <Link to="/terms-conditions"><i className="fas fa-file-contract" /> Terms & Conditions</Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="privacy-header">
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. This policy explains how Orange Travel collects, uses, and protects your personal information.</p>
            <div className="last-updated"><i className="fas fa-calendar-alt" /> Last Updated: December 2024</div>
          </div>

          <div className="privacy-content">
            <section className="privacy-section">
              <h2><i className="fas fa-info-circle" /> Introduction</h2>
              <p>At Orange Travel, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices concerning the collection, use, and disclosure of your information when you use our services.</p>
              <p>By accessing or using Orange Travel's services, you agree to the collection and use of information in accordance with this policy. We may update this policy from time to time, and we will notify you of any changes by posting the new Privacy Policy on this page.</p>

              <div className="highlight-box">
                <h4><i className="fas fa-lightbulb" /> Key Principle</h4>
                <p>We believe in transparency and only collect information necessary to provide you with our premium transport services. Your data is never sold to third parties for marketing purposes.</p>
              </div>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-database" /> Information We Collect</h2>
              <p>We collect several types of information for various purposes to provide and improve our services to you:</p>

              <h3>Personal Information</h3>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, and physical address</li>
                <li><strong>Booking Information:</strong> Travel dates, routes, seat preferences, and payment details</li>
                <li><strong>Account Information:</strong> Username, password, and profile preferences</li>
                <li><strong>Identification:</strong> Government-issued ID (for certain services and verification)</li>
                <li><strong>Communication Data:</strong> Messages, feedback, and support queries</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, booking patterns</li>
                <li><strong>Location Data:</strong> General location for route optimization (with consent)</li>
                <li><strong>Cookies Data:</strong> Session cookies and preference cookies</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-cogs" /> How We Use Your Information</h2>
              <p>Your information is used to provide, maintain, and improve our services. We use collected data for various purposes:</p>

              <table className="privacy-table">
                <thead>
                  <tr><th>Purpose</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Service Delivery</strong></td><td>Process bookings, manage reservations, and provide transport services</td></tr>
                  <tr><td><strong>Customer Support</strong></td><td>Respond to inquiries, provide assistance, and resolve issues</td></tr>
                  <tr><td><strong>Service Improvement</strong></td><td>Analyze usage patterns to enhance user experience and service quality</td></tr>
                  <tr><td><strong>Security & Safety</strong></td><td>Ensure the security of our systems and protect user safety</td></tr>
                  <tr><td><strong>Legal Compliance</strong></td><td>Comply with legal obligations and regulatory requirements</td></tr>
                  <tr><td><strong>Marketing Communications</strong></td><td>Send promotional materials (with your consent)</td></tr>
                </tbody>
              </table>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-share-alt" /> Data Sharing & Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>

              <div className="highlight-box">
                <h4><i className="fas fa-handshake" /> Service Providers</h4>
                <p>We may employ third-party companies and individuals to facilitate our services ("Service Providers"), provide services on our behalf, perform service-related services, or assist us in analyzing how our services are used.</p>
              </div>

              <ul>
                <li><strong>Transport Partners:</strong> Necessary information for service delivery (driver, route details)</li>
                <li><strong>Payment Processors:</strong> Secure payment processing services</li>
                <li><strong>Legal Requirements:</strong> To comply with laws, regulations, or legal requests</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
                <li><strong>Safety Emergencies:</strong> To protect against harm to rights, property, or safety</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-shield-alt" /> Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

              <ul>
                <li><strong>Encryption:</strong> All sensitive data is encrypted using SSL/TLS technology</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                <li><strong>Employee Training:</strong> Privacy and security awareness training for staff</li>
                <li><strong>Incident Response:</strong> Procedures for handling data breaches</li>
              </ul>

              <div className="highlight-box">
                <h4><i className="fas fa-lock" /> Security Commitment</h4>
                <p>While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. We continuously update our security practices to protect your data.</p>
              </div>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-user-check" /> Your Rights & Choices</h2>
              <p>You have certain rights regarding your personal information:</p>

              <table className="privacy-table">
                <thead>
                  <tr><th>Right</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Access</strong></td><td>Request copies of your personal data</td></tr>
                  <tr><td><strong>Rectification</strong></td><td>Request correction of inaccurate or incomplete data</td></tr>
                  <tr><td><strong>Erasure</strong></td><td>Request deletion of your personal data</td></tr>
                  <tr><td><strong>Restriction</strong></td><td>Request restriction of processing your data</td></tr>
                  <tr><td><strong>Portability</strong></td><td>Request transfer of your data to another organization</td></tr>
                  <tr><td><strong>Objection</strong></td><td>Object to processing of your personal data</td></tr>
                </tbody>
              </table>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-cookie-bite" /> Cookies Policy</h2>
              <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information.</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Necessary for basic website functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> Track effectiveness of marketing campaigns</li>
              </ul>
              <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.</p>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-child" /> Children's Privacy</h2>
              <p>Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children under 16.</p>
              <p>If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.</p>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-globe-asia" /> International Data Transfers</h2>
              <p>Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>
              <p>We ensure appropriate safeguards are in place for international data transfers and comply with applicable data protection laws.</p>
            </section>

            <section className="privacy-section">
              <h2><i className="fas fa-sync-alt" /> Changes to This Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
              <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            </section>

            <div className="contact-card">
              <h3><i className="fas fa-headset" /> Contact Our Privacy Team</h3>
              <p>If you have any questions about this Privacy Policy, your personal information, or wish to exercise your rights, please contact our dedicated privacy team.</p>
              <div className="contact-info">
                <div className="contact-item"><i className="fas fa-envelope" /><div className="contact-text"><h4>Email Address</h4><p>privacy@orangetravel.lk</p></div></div>
                <div className="contact-item"><i className="fas fa-phone" /><div className="contact-text"><h4>Phone Number</h4><p>+94 11 234 5678 (Ext. 2)</p></div></div>
                <div className="contact-item"><i className="fas fa-map-marker-alt" /><div className="contact-text"><h4>Mailing Address</h4><p>Orange Travel Ltd.<br />123 Privacy Lane, Colombo 01000</p></div></div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>OrangeTravel</h3>
              <p>Premium transport services across Sri Lanka, offering comfort, safety, and unforgettable journeys.</p>
              <div className="social-links">
                <a href="#" className="facebook"><i className="fab fa-facebook-f" /></a>
                <a href="#" className="twitter"><i className="fab fa-twitter" /></a>
                <a href="#" className="instagram"><i className="fab fa-instagram" /></a>
                <a href="#" className="whatsapp"><i className="fab fa-whatsapp" /></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <Link to="/seat-booking"><i className="fas fa-chevron-right" /> Seat Booking</Link>
              <a href="#"><i className="fas fa-chevron-right" /> Group Travel</a>
              <a href="#"><i className="fas fa-chevron-right" /> Corporate Services</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link to="/privacy-policy" className="active"><i className="fas fa-chevron-right" /> Privacy Policy</Link>
              <Link to="/terms-conditions"><i className="fas fa-chevron-right" /> Terms & Conditions</Link>
              <a href="#"><i className="fas fa-chevron-right" /> FAQ</a>
              <Link to="/contact-us"><i className="fas fa-chevron-right" /> Contact Us</Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="#"><i className="fas fa-map-marker-alt" /> Colombo, Sri Lanka</a>
              <a href="tel:+94112345678"><i className="fas fa-phone" /> +94 11 234 5678</a>
              <a href="mailto:info@orangetravel.lk"><i className="fas fa-envelope" /> info@orangetravel.lk</a>
              <a href="#"><i className="fas fa-clock" /> 24/7 Support</a>
            </div>
          </div>
          <div className="footer-bottom"><p>&copy; 2024 OrangeTravel Sri Lanka. All rights reserved. | Premium Transport Services</p><p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>This site is protected by reCAPTCHA and the Google <a href="#" style={{ color: 'var(--primary-orange)' }}>Privacy Policy</a> and <a href="#" style={{ color: 'var(--primary-orange)' }}>Terms of Service</a> apply.</p></div>
        </div>
      </footer>
    </>
  );
}

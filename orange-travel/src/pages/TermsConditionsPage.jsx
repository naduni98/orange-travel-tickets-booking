import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TermsConditions.css';

export default function TermsConditionsPage() {
  useEffect(() => {
    // Create glass shapes and luxury shapes
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

    // Smooth scroll for anchors
    const anchors = document.querySelectorAll('a[href^="#"]');
    const anchorHandlers = [];
    anchors.forEach(anchor => {
      const handler = (e) => {
        if (anchor.getAttribute('href') !== '#') {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // quick nav active state
          document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
          anchor.classList.add('active');
        }
      };
      anchor.addEventListener('click', handler);
      anchorHandlers.push(() => anchor.removeEventListener('click', handler));
    });

    // Navbar scroll/parallax
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

      // Highlight current section in quick nav
      const sections = document.querySelectorAll('.terms-section');
      const navLinks = document.querySelectorAll('.nav-links a');
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) currentSection = section.id;
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
      });
    };
    window.addEventListener('scroll', onScroll);

    // Animate sections on scroll
    const animatedElements = document.querySelectorAll('.terms-section');
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

    // Contact item hover icons
    const contactItems = document.querySelectorAll('.contact-item');
    const enter = (e) => { const icon = e.currentTarget.querySelector('i'); icon.style.transform = 'scale(1.2)'; };
    const leave = (e) => { const icon = e.currentTarget.querySelector('i'); icon.style.transform = 'scale(1)'; };
    contactItems.forEach(item => { item.addEventListener('mouseenter', enter); item.addEventListener('mouseleave', leave); });

    // Table row hover translate
    const tableRows = document.querySelectorAll('.terms-table tr');
    tableRows.forEach(row => {
      row.addEventListener('mouseenter', function() { this.style.transform = 'translateX(10px)'; });
      row.addEventListener('mouseleave', function() { this.style.transform = 'translateX(0)'; });
    });

    // Add dynamic style for small animations
    const style = document.createElement('style');
    style.textContent = `
      .terms-section { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .contact-item i, .terms-table tr { transition: transform 0.3s ease; }
      .important-notice, .warning-box, .info-box { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
      .nav-links a.active { background: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange)) !important; color: white !important; border-color: var(--primary-orange) !important; }
      .nav-links a.active i { color: white !important; }
      @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      .terms-content::before { background-size: 200% 200%; animation: gradientShift 3s ease infinite; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      const shapes = document.querySelectorAll('.index-shape, .luxury-shape');
      shapes.forEach(shape => shape.style.animationPlayState = 'running');

      // activate first quick-nav link
      const navLinks = document.querySelectorAll('.nav-links a');
      if (navLinks.length > 0) navLinks[0].classList.add('active');
    }, 100);

    // Section number animation
    const sectionHeaders = document.querySelectorAll('.terms-section h2');
    sectionHeaders.forEach((header, index) => {
      const number = document.createElement('span');
      number.className = 'section-number';
      number.textContent = `${index + 1}.`;
      number.style.cssText = `color: var(--primary-orange); font-weight:800; margin-right:10px; font-size:28px; opacity:0; transform:scale(0); transition: opacity 0.5s ease, transform 0.5s ease;`;
      header.insertBefore(number, header.firstChild);
      const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { setTimeout(() => { number.style.opacity = '1'; number.style.transform = 'scale(1)'; }, index * 100); } });
      }, { threshold: 0.5 });
      numberObserver.observe(header);
    });

    // cleanup
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
            <Link to="/privacy-policy"><i className="fas fa-shield-alt" /> Privacy Policy</Link>
            <Link to="/terms-conditions" className="active"><i className="fas fa-file-contract" /> Terms & Conditions</Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="terms-header">
            <h1>Terms & Conditions</h1>
            <p>Please read these terms and conditions carefully before using Orange Travel services. These terms govern your relationship with Orange Travel and your use of our services.</p>
            <div className="last-updated"><i className="fas fa-calendar-alt" /> Last Updated: December 2024</div>
          </div>

          <div className="quick-nav">
            <h3><i className="fas fa-compass" /> Quick Navigation</h3>
            <div className="nav-links">
              <a href="#acceptance"><i className="fas fa-check-circle" /> Acceptance of Terms</a>
              <a href="#bookings"><i className="fas fa-ticket-alt" /> Bookings & Reservations</a>
              <a href="#payments"><i className="fas fa-credit-card" /> Payments & Refunds</a>
              <a href="#cancellations"><i className="fas fa-ban" /> Cancellations</a>
              <a href="#liability"><i className="fas fa-balance-scale" /> Liability</a>
              <a href="#conduct"><i className="fas fa-user-check" /> User Conduct</a>
              <a href="#intellectual"><i className="fas fa-copyright" /> Intellectual Property</a>
              <a href="#termination"><i className="fas fa-power-off" /> Termination</a>
              <a href="#governing"><i className="fas fa-gavel" /> Governing Law</a>
            </div>
          </div>

          <div className="terms-content">
            <section className="terms-section" id="acceptance">
              <h2><i className="fas fa-check-circle" /> 1. Acceptance of Terms</h2>
              <p>By accessing or using Orange Travel's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>

              <div className="info-box">
                <h4><i className="fas fa-info-circle" /> Important Information</h4>
                <p>These terms constitute a legally binding agreement between you and Orange Travel Sri Lanka. By using our services, you represent that you are at least 18 years old or have parental consent.</p>
              </div>
            </section>

            <section className="terms-section" id="bookings">
              <h2><i className="fas fa-ticket-alt" /> 2. Bookings & Reservations</h2>
              <p>All bookings are subject to availability and confirmation. To secure your booking, you must complete the booking process and make the required payment.</p>

              <h3>2.1 Booking Requirements</h3>
              <ul>
                <li>Provide accurate personal information (name, contact details, identification)</li>
                <li>Select preferred travel dates, routes, and seat preferences</li>
                <li>Complete payment through approved payment methods</li>
                <li>Receive booking confirmation via email/SMS</li>
                <li>Present valid ID at boarding time</li>
              </ul>

              <h3>2.2 Seat Allocation</h3>
              <p>While we strive to accommodate seat preferences, specific seat allocations are not guaranteed and are subject to availability and operational requirements.</p>

              <div className="important-notice">
                <h4><i className="fas fa-exclamation-triangle" /> Important Notice</h4>
                <p>Arrive at the departure point at least 30 minutes before scheduled departure time. Late arrivals may result in forfeiture of booking without refund.</p>
              </div>
            </section>

            <section className="terms-section" id="payments">
              <h2><i className="fas fa-credit-card" /> 3. Payments & Refunds</h2>
              <p>All payments must be made in Sri Lankan Rupees (LKR) through our approved payment methods.</p>

              <table className="terms-table">
                <thead>
                  <tr><th>Payment Method</th><th>Processing Time</th><th>Additional Fees</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Credit/Debit Cards</strong></td><td>Instant</td><td>2.5% processing fee</td></tr>
                  <tr><td><strong>Bank Transfers</strong></td><td>24-48 hours</td><td>Bank charges may apply</td></tr>
                  <tr><td><strong>Mobile Wallets</strong></td><td>Instant</td><td>No additional fees</td></tr>
                  <tr><td><strong>Cash Payments</strong></td><td>Immediate</td><td>No additional fees</td></tr>
                </tbody>
              </table>

              <h3>3.1 Refund Policy</h3>
              <ul>
                <li><strong>Cancellation by Customer:</strong> Refer to cancellation policy section</li>
                <li><strong>Cancellation by Orange Travel:</strong> Full refund within 7 business days</li>
                <li><strong>Service Disruption:</strong> Partial or full refund based on circumstances</li>
                <li><strong>Processing Time:</strong> Refunds processed within 10-15 business days</li>
              </ul>

              <div className="warning-box">
                <h4><i className="fas fa-times-circle" /> Non-Refundable Fees</h4>
                <p>Processing fees, convenience charges, and service fees are non-refundable under any circumstances. Refunds are issued to the original payment method only.</p>
              </div>
            </section>

            <section className="terms-section" id="cancellations">
              <h2><i className="fas fa-ban" /> 4. Cancellations & Changes</h2>

              <h3>4.1 Customer Cancellations</h3>
              <table className="terms-table">
                <thead>
                  <tr><th>Cancellation Time</th><th>Refund Amount</th><th>Cancellation Fee</th></tr>
                </thead>
                <tbody>
                  <tr><td>More than 48 hours before departure</td><td>90% of fare</td><td>10% of fare</td></tr>
                  <tr><td>24-48 hours before departure</td><td>75% of fare</td><td>25% of fare</td></tr>
                  <tr><td>Less than 24 hours before departure</td><td>50% of fare</td><td>50% of fare</td></tr>
                  <tr><td>Less than 6 hours before departure</td><td>No refund</td><td>100% of fare</td></tr>
                </tbody>
              </table>

              <h3>4.2 Changes to Bookings</h3>
              <ul>
                <li>Date/time changes allowed up to 24 hours before departure</li>
                <li>Change fee: 10% of original fare (subject to availability)</li>
                <li>Route changes treated as cancellation and new booking</li>
                <li>Seat upgrades may be available at additional cost</li>
              </ul>

              <div className="info-box">
                <h4><i className="fas fa-life-ring" /> Emergency Assistance</h4>
                <p>For emergency cancellations due to medical reasons, contact our customer service with supporting documentation for special consideration.</p>
              </div>
            </section>

            <section className="terms-section" id="liability">
              <h2><i className="fas fa-balance-scale" /> 5. Liability & Responsibility</h2>
              <h3>5.1 Orange Travel's Liability</h3>
              <p>We take all reasonable care to ensure our services are provided with due skill and attention. However, our liability is limited as follows:</p>
              <ul>
                <li>We are not liable for delays caused by circumstances beyond our control</li>
                <li>Maximum liability for lost/damaged luggage is Rs. 10,000 per item</li>
                <li>We are not liable for personal injury except where caused by negligence</li>
                <li>We are not responsible for missed connections or additional expenses</li>
              </ul>

              <h3>5.2 Passenger Responsibilities</h3>
              <ul>
                <li>Arrive at departure point on time with valid identification</li>
                <li>Comply with all safety instructions and regulations</li>
                <li>Behave in a manner that doesn't disturb other passengers</li>
                <li>Take reasonable care of personal belongings</li>
                <li>Follow all applicable laws and regulations</li>
              </ul>

              <div className="warning-box">
                <h4><i className="fas fa-shield-alt" /> Force Majeure</h4>
                <p>Orange Travel shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control including natural disasters, strikes, government actions, or other force majeure events.</p>
              </div>
            </section>

            <section className="terms-section" id="conduct">
              <h2><i className="fas fa-user-check" /> 6. User Conduct & Prohibited Activities</h2>

              <h3>6.1 Expected Conduct</h3>
              <ul>
                <li>Treat staff and fellow passengers with respect</li>
                <li>Follow all posted signs and instructions</li>
                <li>Keep noise levels reasonable</li>
                <li>Maintain personal hygiene</li>
                <li>Dispose of trash properly</li>
              </ul>

              <h3>6.2 Prohibited Activities</h3>
              <ul>
                <li><strong>Smoking:</strong> Strictly prohibited on all vehicles</li>
                <li><strong>Alcohol/Drugs:</strong> Consumption or possession prohibited</li>
                <li><strong>Weapons:</strong> Any type of weapon is strictly prohibited</li>
                <li><strong>Illegal Items:</strong> Transportation of illegal substances prohibited</li>
                <li><strong>Disruptive Behavior:</strong> Harassment, fighting, or disturbance</li>
                <li><strong>Damage to Property:</strong> Willful damage to vehicles or property</li>
                <li><strong>Unauthorized Commercial Activity:</strong> Solicitation or selling</li>
              </ul>

              <div className="warning-box">
                <h4><i className="fas fa-exclamation" /> Consequences of Violation</h4>
                <p>Violation of conduct rules may result in immediate removal from service, banning from future travel, legal action, and/or reporting to authorities. No refund will be provided in such cases.</p>
              </div>
            </section>

            <section className="terms-section" id="intellectual">
              <h2><i className="fas fa-copyright" /> 7. Intellectual Property</h2>
              <p>All content, trademarks, logos, and intellectual property displayed on our website, vehicles, and promotional materials are the property of Orange Travel or our licensors.</p>

              <h3>7.1 Restrictions</h3>
              <ul>
                <li>Content may not be reproduced without written permission</li>
                <li>Logos and trademarks may not be used without authorization</li>
                <li>Website content is for personal use only</li>
                <li>Reverse engineering or copying of systems is prohibited</li>
              </ul>

              <div className="info-box">
                <h4><i className="fas fa-lightbulb" /> User-Generated Content</h4>
                <p>By submitting feedback, reviews, or content to Orange Travel, you grant us a perpetual, royalty-free license to use, modify, and display such content for promotional and business purposes.</p>
              </div>
            </section>

            <section className="terms-section" id="termination">
              <h2><i className="fas fa-power-off" /> 8. Termination & Suspension</h2>

              <h3>8.1 By Orange Travel</h3>
              <p>We reserve the right to terminate or suspend your access to our services immediately, without prior notice or liability, for any reason including:</p>
              <ul>
                <li>Violation of these Terms and Conditions</li>
                <li>Suspicious or fraudulent activity</li>
                <li>Non-payment or payment disputes</li>
                <li>Safety or security concerns</li>
                <li>Legal or regulatory requirements</li>
              </ul>

              <h3>8.2 By User</h3>
              <p>You may terminate your relationship with Orange Travel by:</p>
              <ul>
                <li>Ceasing to use our services</li>
                <li>Closing your account (if applicable)</li>
                <li>Requesting account deletion</li>
              </ul>

              <div className="info-box">
                <h4><i className="fas fa-history" /> Post-Termination</h4>
                <p>Upon termination, your right to use our services will immediately cease. Any outstanding obligations (including payments) will survive termination.</p>
              </div>
            </section>

            <section className="terms-section" id="governing">
              <h2><i className="fas fa-gavel" /> 9. Governing Law & Dispute Resolution</h2>

              <h3>9.1 Governing Law</h3>
              <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.</p>

              <h3>9.2 Dispute Resolution</h3>
              <ul>
                <li><strong>Step 1:</strong> Informal negotiation through customer service</li>
                <li><strong>Step 2:</strong> Mediation through recognized mediation service</li>
                <li><strong>Step 3:</strong> Arbitration in Colombo, Sri Lanka</li>
                <li><strong>Step 4:</strong> Legal proceedings in Sri Lankan courts</li>
              </ul>

              <h3>9.3 Jurisdiction</h3>
              <p>Any disputes shall be subject to the exclusive jurisdiction of the courts located in Colombo, Sri Lanka.</p>
            </section>

            <section className="terms-section">
              <h2><i className="fas fa-sync-alt" /> 10. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms and Conditions at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.</p>

              <div className="important-notice">
                <h4><i className="fas fa-bell" /> Notification of Changes</h4>
                <p>We will notify users of changes via email, website notice, or SMS. Your continued use of our services after changes constitutes acceptance of the new terms.</p>
              </div>

              <p><strong>What constitutes a material change will be determined at our sole discretion.</strong></p>
            </section>

            <div className="contact-card">
              <h3><i className="fas fa-question-circle" /> Questions About Our Terms?</h3>
              <p>If you have any questions about these Terms and Conditions, please contact our legal department for clarification.</p>

              <div className="contact-info">
                <div className="contact-item"><i className="fas fa-envelope" /><div className="contact-text"><h4>Legal Department</h4><p>legal@orangetravel.lk</p></div></div>
                <div className="contact-item"><i className="fas fa-phone" /><div className="contact-text"><h4>Legal Hotline</h4><p>+94 11 234 5679</p></div></div>
                <div className="contact-item"><i className="fas fa-map-marker-alt" /><div className="contact-text"><h4>Legal Address</h4><p>Orange Travel Legal Dept.<br />123 Legal Lane, Colombo 01000</p></div></div>
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
              <Link to="/privacy-policy"><i className="fas fa-chevron-right" /> Privacy Policy</Link>
              <Link to="/terms-conditions" className="active"><i className="fas fa-chevron-right" /> Terms & Conditions</Link>
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
          <div className="footer-bottom"><p>&copy; 2024 OrangeTravel Sri Lanka. All rights reserved. | Premium Transport Services</p><p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>By using our services, you agree to our <a href="/terms-conditions" style={{ color: 'var(--primary-orange)' }}>Terms & Conditions</a> and <a href="/privacy-policy" style={{ color: 'var(--primary-orange)' }}>Privacy Policy</a>.</p></div>
        </div>
      </footer>
    </>
  );
}

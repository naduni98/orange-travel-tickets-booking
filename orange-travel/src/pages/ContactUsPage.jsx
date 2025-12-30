import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactUs.css';

export default function ContactUsPage() {
  const overlayRef = useRef(null);
  const successRef = useRef(null);
  const formRef = useRef(null);
  const indexShapesRef = useRef(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0); // index of open FAQ

  useEffect(() => {
    // Shapes
    const indexShapes = document.getElementById('indexShapes');
    const shapeCount = 20;
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
    }

    // Mobile menu behavior
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const mobileHandler = () => {
      if (!navMenu || !mobileMenuBtn) return;
      navMenu.classList.toggle('active');
      mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      setNavActive(navMenu.classList.contains('active'));
    };
    mobileMenuBtn?.addEventListener('click', mobileHandler);

    // Close mobile menu on click outside
    const outsideClick = (e) => {
      if (!navMenu || !mobileMenuBtn) return;
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        setNavActive(false);
      }
    };
    document.addEventListener('click', outsideClick);

    // FAQ intersection / animations
    const animatedElements = document.querySelectorAll('.contact-card, .faq-item, .contact-images-section, .vehicle-description');
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

    // ripple effect for buttons (delegated)
    const handleRipple = (e) => {
      const btn = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.7);transform:scale(0);animation:ripple 0.8s linear;width:${size}px;height:${size}px;top:${y}px;left:${x}px;pointer-events:none;z-index:0;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    };

    document.querySelectorAll('.submit-btn, .faq-question').forEach(button => {
      button.addEventListener('click', handleRipple);
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        if (currentScroll > lastScroll) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;

      // parallax shapes
      const shapes = document.querySelector('.index-shapes');
      if (shapes) shapes.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
    };
    window.addEventListener('scroll', onScroll);

    // Initial animations
    setTimeout(() => {
      const shapes = document.querySelectorAll('.index-shape');
      shapes.forEach(shape => shape.style.animationPlayState = 'running');
    }, 100);

    // open first FAQ after short delay
    const initFAQ = setTimeout(() => setOpenFAQ(0), 1000);

    return () => {
      mobileMenuBtn?.removeEventListener('click', mobileHandler);
      document.removeEventListener('click', outsideClick);
      document.querySelectorAll('.submit-btn, .faq-question').forEach(button => {
        button.removeEventListener('click', handleRipple);
      });
      window.removeEventListener('scroll', onScroll);
      clearTimeout(initFAQ);
      observer.disconnect();
      // clean shapes
      if (indexShapes) while (indexShapes.firstChild) indexShapes.removeChild(indexShapes.firstChild);
    };
  }, []);

  // expose close and toggle functions globally to preserve original API
  useEffect(()=>{
    window.closeSuccessMessage = () => {
      setSuccessVisible(false);
      setTimeout(()=>{
        overlayRef.current && overlayRef.current.classList.remove('show');
      }, 300);
    };
    window.toggleFAQ = (el) => {
      // find index of clicked FAQ element if the original inline handler used element param
      const all = Array.from(document.querySelectorAll('.faq-question'));
      const idx = all.indexOf(el);
      if (idx >= 0) setOpenFAQ(prev => (prev === idx ? -1 : idx));
    };
    return () => {
      if (window.closeSuccessMessage) delete window.closeSuccessMessage;
      if (window.toggleFAQ) delete window.toggleFAQ;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const name = form.name?.value;
    const email = form.email?.value;
    const phone = form.phone?.value;
    const subject = form.subject?.value;
    const message = form.message?.value;

    if (overlayRef.current) overlayRef.current.classList.add('show');
    setTimeout(()=> setSuccessVisible(true), 50);

    form.reset();

    console.log('Contact form submitted:', { name, email, phone, subject, message, timestamp: new Date().toISOString() });
  };

  const closeSuccess = () => {
    setSuccessVisible(false);
    setTimeout(()=> overlayRef.current && overlayRef.current.classList.remove('show'), 300);
  };

  const handleFAQClick = (i) => {
    setOpenFAQ(prev => prev === i ? -1 : i);
  };

  return (
    <>
      <div className="bg-visual" />
      <div className="index-shapes" id="indexShapes" ref={indexShapesRef} />

      <div className="overlay" id="overlay" ref={overlayRef} onClick={closeSuccess} />

      <div className={`success-message ${successVisible ? 'show' : ''}`} id="successMessage" ref={successRef}>
        <div className="success-icon"><i className="fas fa-check" /></div>
        <div className="success-content">
          <h3>Message Sent!</h3>
          <p>Thank you for contacting Orange Travel. Our team will respond to your inquiry within 24 hours.</p>
          <button onClick={closeSuccess}><i className="fas fa-check" /> Continue</button>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo"><span className="logo-icon"><i className="fas fa-shuttle-van" /></span><span>OrangeTravel</span></Link>
          <button className="mobile-menu-btn" id="mobileMenuBtn"><i className="fas fa-bars" /></button>
          <div className={`nav-menu ${navActive ? 'active' : ''}`} id="navMenu">
            <Link to="/"> <i className="fas fa-home" /> Home</Link>
            <Link to="/seat-booking"><i className="fas fa-chair" /> Seat Booking</Link>
            <Link to="/contact-us" className="active"><i className="fas fa-phone-alt" /> Contact Us</Link>
            <Link to="/privacy-policy"><i className="fas fa-shield-alt" /> Privacy Policy</Link>
            <Link to="/terms-conditions"><i className="fas fa-file-contract" /> Terms & Conditions</Link>
          </div>
        </div>
      </nav>

      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1>Contact Orange Travel</h1>
            <p>Have questions or need assistance? Our dedicated support team is here to help you plan your perfect Sri Lankan journey.</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">Reach out to us through any of these channels. We're always happy to assist you with your travel needs.</p>

          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-card-header">
                  <div className="contact-icon"><i className="fas fa-phone-alt" /></div>
                  <h3>Phone Support</h3>
                </div>
                <div className="contact-card-content">
                  <p><i className="fas fa-phone" /> <a href="tel:+94112345678">+94 11 234 5678</a></p>
                  <p><i className="fab fa-whatsapp" /> <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer">+94 77 123 4567</a></p>
                  <p>Available 24/7 for emergencies</p>
                  <p>Business Hours: 8:00 AM - 10:00 PM</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <div className="contact-icon"><i className="fas fa-envelope" /></div>
                  <h3>Email</h3>
                </div>
                <div className="contact-card-content">
                  <p><i className="fas fa-envelope" /> <a href="mailto:info@orangetravel.lk">info@orangetravel.lk</a></p>
                  <p><i className="fas fa-headset" /> <a href="mailto:support@orangetravel.lk">support@orangetravel.lk</a></p>
                  <p><i className="fas fa-briefcase" /> <a href="mailto:corporate@orangetravel.lk">corporate@orangetravel.lk</a></p>
                  <p>Response time: Within 24 hours</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <div className="contact-icon"><i className="fas fa-map-marker-alt" /></div>
                  <h3>Office Location</h3>
                </div>
                <div className="contact-card-content">
                  <p><i className="fas fa-building" /> Orange Travel Headquarters</p>
                  <p><i className="fas fa-location-dot" /> 123 Galle Road, Colombo 03</p>
                  <p><i className="fas fa-city" /> Colombo, Sri Lanka</p>
                  <p><i className="fas fa-clock" /> Open: Mon-Sat, 8:30 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <div className="contact-icon"><i className="fas fa-headset" /></div>
                  <h3>Social Media</h3>
                </div>
                <div className="contact-card-content">
                  <p><i className="fab fa-facebook" /> <a href="#" target="_blank" rel="noreferrer">Facebook: @OrangeTravelLK</a></p>
                  <p><i className="fab fa-instagram" /> <a href="#" target="_blank" rel="noreferrer">Instagram: @OrangeTravel</a></p>
                  <p><i className="fab fa-twitter" /> <a href="#" target="_blank" rel="noreferrer">Twitter: @OrangeTravelLK</a></p>
                  <p>Follow us for updates and promotions</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <form id="contactForm" ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="name">Full Name *</label><input name="name" type="text" id="name" placeholder="Enter your full name" required /></div>
                <div className="form-group"><label htmlFor="email">Email Address *</label><input name="email" type="email" id="email" placeholder="you@example.com" required /></div>
                <div className="form-group"><label htmlFor="phone">Phone Number</label><input name="phone" type="tel" id="phone" placeholder="+94 77 123 4567" /></div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select name="subject" id="subject" required>
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="schedule">Schedule Information</option>
                    <option value="lost">Lost & Found</option>
                    <option value="corporate">Corporate Booking</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group"><label htmlFor="message">Message *</label><textarea name="message" id="message" placeholder="Please provide details about your inquiry..." required /></div>
                <button type="submit" className="submit-btn"><i className="fas fa-paper-plane" /> Send Message</button>

                <div className="contact-images-section">
                  <div className="contact-image-container">
                    <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Orange Travel Support Team" className="contact-image" />
                    <div className="contact-image-overlay"><div className="contact-image-text"><h4>Our Support Team</h4><p>Ready to assist you 24/7 with your travel needs</p></div></div>
                  </div>

                  <div className="contact-image-container">
                    <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Orange Travel Premium Vehicles" className="contact-image" />
                    <div className="contact-image-overlay"><div className="contact-image-text"><h4>Premium Vehicles</h4><p>Experience comfort and safety with our modern fleet</p></div></div>
                  </div>

                  <div className="vehicle-description">
                    <h4><i className="fas fa-car-side" /> About Our Premium Fleet</h4>
                    <p>At Orange Travel, we pride ourselves on maintaining a modern fleet of vehicles equipped with the latest safety features and amenities. Our buses and vans are regularly serviced and inspected to ensure your journey is comfortable, safe, and enjoyable.</p>
                    <div className="vehicle-features">
                      <div className="feature-item"><i className="fas fa-shield-alt" /> GPS Tracking</div>
                      <div className="feature-item"><i className="fas fa-snowflake" /> Air Conditioning</div>
                      <div className="feature-item"><i className="fas fa-wifi" /> Free WiFi</div>
                      <div className="feature-item"><i className="fas fa-tv" /> Entertainment</div>
                      <div className="feature-item"><i className="fas fa-couch" /> Reclining Seats</div>
                      <div className="feature-item"><i className="fas fa-first-aid" /> First Aid Kits</div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Visit Our Office</h2>
          <p className="section-subtitle">Find us at our headquarters in Colombo for in-person assistance and consultation.</p>
          <div className="map-container"><div className="map-placeholder"><i className="fas fa-map-marked-alt" /><h3>Orange Travel Headquarters</h3><p>123 Galle Road, Colombo 03, Sri Lanka</p><p style={{ marginTop: 15, fontSize: 14 }}><i className="fas fa-directions" /> Located near Galle Face Green, easily accessible by public transport</p></div></div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Find quick answers to common questions about our services and contact procedures.</p>

          <div className="faq-container">
            {[
              { q: 'What is your response time for inquiries?', a: 'We typically respond to all inquiries within 24 hours. For urgent matters, please call our 24/7 emergency hotline at +94 77 123 4567. Email responses are usually faster during business hours (8:00 AM - 10:00 PM).' },
              { q: 'How can I book tickets over the phone?', a: 'You can call our booking hotline at +94 11 234 5678. Our agents will assist you with seat selection, payment, and provide booking confirmation. For faster service, have your travel dates, route preference, and passenger details ready.' },
              { q: 'Do you offer corporate booking services?', a: 'Yes! We provide dedicated corporate booking services with special rates for businesses. Contact our corporate team at corporate@orangetravel.lk or call +94 11 234 5679 for customized travel solutions for your organization.' },
              { q: 'What should I do if I lost an item on your vehicle?', a: 'Immediately call our lost & found department at +94 77 123 4568 or visit the "Lost & Found" section on our website to file a report. Provide details like route, date, time, and item description for faster recovery.' },
              { q: 'Can I visit your office without an appointment?', a: 'Yes, our office is open to visitors during business hours (Mon-Sat, 8:30 AM - 6:00 PM). While appointments are recommended for corporate consultations, walk-ins are welcome for general inquiries and ticket purchases.' }
            ].map((f, idx) => (
              <div className="faq-item" key={idx}>
                <div className="faq-question" onClick={() => handleFAQClick(idx)}>
                  <h3><i className="fas fa-question-circle" /> {f.q}</h3>
                  <span className="faq-toggle"><i className={`fas ${openFAQ === idx ? 'fa-chevron-up' : 'fa-chevron-down'}`} /></span>
                </div>
                <div className={`faq-answer ${openFAQ === idx ? 'active' : ''}`}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <a href="/seat-booking"><i className="fas fa-chevron-right" /> Seat Booking</a>
              <a href="#"><i className="fas fa-chevron-right" /> Group Travel</a>
              <a href="#"><i className="fas fa-chevron-right" /> Corporate Services</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="/privacy-policy"><i className="fas fa-chevron-right" /> Privacy Policy</a>
              <a href="/terms-conditions"><i className="fas fa-chevron-right" /> Terms & Conditions</a>
              <a href="#"><i className="fas fa-chevron-right" /> FAQ</a>
              <a href="/contact-us"><i className="fas fa-chevron-right" /> Contact Us</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="#"><i className="fas fa-map-marker-alt" /> Colombo, Sri Lanka</a>
              <a href="tel:+94112345678"><i className="fas fa-phone" /> +94 11 234 5678</a>
              <a href="mailto:info@orangetravel.lk"><i className="fas fa-envelope" /> info@orangetravel.lk</a>
              <a href="#"><i className="fas fa-clock" /> 24/7 Support</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 OrangeTravel Sri Lanka. All rights reserved. | Premium Transport Services</p>
            <p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>This site is protected by reCAPTCHA and the Google <a href="#" style={{ color: 'var(--primary-orange)' }}>Privacy Policy</a> and <a href="#" style={{ color: 'var(--primary-orange)' }}>Terms of Service</a> apply.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

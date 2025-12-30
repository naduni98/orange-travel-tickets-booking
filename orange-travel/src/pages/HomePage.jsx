import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Home.css';

export default function HomePage() {
  useEffect(() => {
    // Ported DOM interactions from original HTML into effect
    // Many functions attach to window so HTML onClick handlers still work if needed

    const cleanupFns = [];

    // Create glass shapes
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

      // cleanup shapes
      cleanupFns.push(() => {
        while (indexShapes.firstChild) indexShapes.removeChild(indexShapes.firstChild);
      });
    }

    // Animated counters
    const counters = document.querySelectorAll('.stat-number');
    const intervalIds = [];
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count')) || 0;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, duration / steps);

      intervalIds.push(timer);
    });

    cleanupFns.push(() => intervalIds.forEach(id => clearInterval(id)));

    // Basic UI toggles - mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
      const mobileMenuHandler = () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      };

      mobileMenuBtn.addEventListener('click', mobileMenuHandler);

      const outsideClick = (event) => {
        if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
          navMenu.classList.remove('active');
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
      };

      document.addEventListener('click', outsideClick);

      cleanupFns.push(() => {
        mobileMenuBtn.removeEventListener('click', mobileMenuHandler);
        document.removeEventListener('click', outsideClick);
      });
    }

    // Auth tabs switching
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    const switchAuth = (tabName) => {
      authTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
      authForms.forEach(f => f.classList.toggle('active', f.id === (tabName === 'signin' ? 'signinForm' : 'signupForm')));
    };

    const authTabHandler = (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      switchAuth(tab);
    };

    authTabs.forEach(t => t.addEventListener('click', authTabHandler));
    cleanupFns.push(() => authTabs.forEach(t => t.removeEventListener('click', authTabHandler)));

    // Switch links inside forms
    const switchLinks = document.querySelectorAll('.switch-tab');
    const switchLinkHandler = (e) => {
      e.preventDefault();
      const tab = e.currentTarget.getAttribute('data-tab');
      switchAuth(tab);
      document.getElementById(tab === 'signup' ? 'signupForm' : 'signinForm')?.scrollIntoView({ behavior: 'smooth' });
    };
    switchLinks.forEach(l => l.addEventListener('click', switchLinkHandler));
    cleanupFns.push(() => switchLinks.forEach(l => l.removeEventListener('click', switchLinkHandler)));

    // Social login stub
    window.socialLogin = (provider) => {
      console.log('social login:', provider);
      // Placeholder: open provider auth flow or show a toast
    };
    cleanupFns.push(() => { delete window.socialLogin; });

    // Lost & Found category selection
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryHandler = (e) => {
      const selected = e.currentTarget.getAttribute('data-category');
      categoryCards.forEach(c => c.classList.toggle('active', c === e.currentTarget));
      const hidden = document.getElementById('item-category');
      if (hidden) hidden.value = selected;
    };
    categoryCards.forEach(c => c.addEventListener('click', categoryHandler));
    cleanupFns.push(() => categoryCards.forEach(c => c.removeEventListener('click', categoryHandler)));

    // Lost item report submission
    const lostForm = document.getElementById('lostItemReport');
    const lostSubmitHandler = (e) => {
      e.preventDefault();
      const reportId = `LF-${Math.floor(Math.random() * 9000) + 1000}`;
      const itemEl = document.getElementById('item-name');
      const item = itemEl ? itemEl.value : 'Item';
      const routeEl = document.getElementById('lost-route');
      const route = routeEl ? routeEl.value : '';
      const dateEl = document.getElementById('lost-date');
      const date = dateEl ? dateEl.value : '';

      // Update transaction display
      const reportIdEl = document.getElementById('reportId');
      const reportItemEl = document.getElementById('reportItem');
      const reportRouteEl = document.getElementById('reportRoute');
      const reportDateTimeEl = document.getElementById('reportDateTime');

      if (reportIdEl) reportIdEl.textContent = reportId;
      if (reportItemEl) reportItemEl.textContent = item;
      if (reportRouteEl) reportRouteEl.textContent = route || 'Unknown';
      if (reportDateTimeEl) reportDateTimeEl.textContent = date || 'Today';

      const lostTx = document.getElementById('lostfoundTransaction');
      if (lostTx) {
        lostTx.style.display = 'block';
        lostTx.classList.add('visible');
      }

      // Optionally scroll to transaction
      document.getElementById('transactionOverlay')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (lostForm) {
      lostForm.addEventListener('submit', lostSubmitHandler);
      cleanupFns.push(() => lostForm.removeEventListener('submit', lostSubmitHandler));
    }

    // Quick action window
    const quickToggle = document.getElementById('quickActionToggle');
    const quickWindow = document.getElementById('quickActionWindow');
    const closeQuick = document.getElementById('closeQuickAction');

    const toggleQuick = () => {
      if (quickWindow) quickWindow.classList.toggle('open');
    };

    const closeQuickHandler = () => {
      if (quickWindow) quickWindow.classList.remove('open');
    };

    quickToggle?.addEventListener('click', toggleQuick);
    closeQuick?.addEventListener('click', closeQuickHandler);
    cleanupFns.push(() => { quickToggle?.removeEventListener('click', toggleQuick); closeQuick?.removeEventListener('click', closeQuickHandler); });

    // Expose quick actions to window
    window.showLostFoundReport = () => {
      document.getElementById('lostfound-section')?.scrollIntoView({ behavior: 'smooth' });
      if (quickWindow) quickWindow.classList.remove('open');
    };
    cleanupFns.push(() => { delete window.showLostFoundReport; });

    window.scrollToAuth = () => {
      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    };
    cleanupFns.push(() => { delete window.scrollToAuth; });

    // Item found transaction handlers
    window.showItemFoundTransaction = () => {
      const itemTx = document.getElementById('itemfoundTransaction');
      if (itemTx) {
        itemTx.style.display = 'block';
        itemTx.classList.add('visible');
      }
    };
    window.closeItemfoundTransaction = () => {
      const itemTx = document.getElementById('itemfoundTransaction');
      if (itemTx) {
        itemTx.style.display = 'none';
        itemTx.classList.remove('visible');
      }
    };
    cleanupFns.push(() => { delete window.showItemFoundTransaction; delete window.closeItemfoundTransaction; });

    // Lostfound close
    window.closeLostfoundTransaction = () => {
      const lostTx = document.getElementById('lostfoundTransaction');
      if (lostTx) {
        lostTx.style.display = 'none';
        lostTx.classList.remove('visible');
      }
    };
    cleanupFns.push(() => { delete window.closeLostfoundTransaction; });

    // Chatbot handlers
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');

    const toggleChat = () => {
      if (chatbotWindow) chatbotWindow.classList.toggle('open');
    };

    const closeChatHandler = () => {
      if (chatbotWindow) chatbotWindow.classList.remove('open');
    };

    chatbotToggle?.addEventListener('click', toggleChat);
    closeChat?.addEventListener('click', closeChatHandler);

    cleanupFns.push(() => { chatbotToggle?.removeEventListener('click', toggleChat); closeChat?.removeEventListener('click', closeChatHandler); });

    // Chat send handling
    const chatBody = document.getElementById('chatBody');
    const sendButton = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');

    const appendMessage = (text, from = 'user') => {
      if (!chatBody) return;
      const wrapper = document.createElement('div');
      wrapper.className = `chat-message ${from === 'user' ? 'user-message' : 'bot-message'}`;
      wrapper.innerHTML = `<div class="message-avatar">${from === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'}</div><div class="message-content">${text}<div class="message-time">Just now</div></div>`;
      chatBody.appendChild(wrapper);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const sendHandler = () => {
      const val = chatInput ? (chatInput.value || '').trim() : '';
      if (!val) return;
      appendMessage(val, 'user');
      if (chatInput) chatInput.value = '';

      // bot response (placeholder)
      setTimeout(() => {
        appendMessage(`Thanks! I can help with: \n- Book seat\n- Check lost item status\n- Contact support`, 'bot');
      }, 600);
    };

    sendButton?.addEventListener('click', sendHandler);
    cleanupFns.push(() => sendButton?.removeEventListener('click', sendHandler));

    // Quick reply clicks
    const quickReplies = document.querySelectorAll('.quick-reply');
    const quickReplyHandler = (e) => {
      const text = e.currentTarget.getAttribute('data-reply');
      if (chatInput) chatInput.value = text || '';
      sendHandler();
    };
    quickReplies.forEach(q => q.addEventListener('click', quickReplyHandler));
    cleanupFns.push(() => quickReplies.forEach(q => q.removeEventListener('click', quickReplyHandler)));

    // cleanup
    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <>
      {/* Background Visuals */}
      <div className="bg-visual" />
      <div className="index-shapes" id="indexShapes" />

      {/* Transaction Overlay */}
      <div className="transaction-overlay" id="transactionOverlay" />

      {/* Premium Transaction */}
      <div className="premium-transaction" id="authTransaction">
        <div className="premium-transaction-icon" id="authTransactionIcon">
          <i className="fas fa-user-check" />
        </div>
        <div className="premium-transaction-content">
          <h3 id="authTransactionTitle">Welcome to Orange Travel</h3>
          <p id="authTransactionText">You have successfully signed in to your premium account.</p>

          <div className="premium-transaction-details" id="authTransactionDetails">
            <div>
              <span className="label">Account:</span>
              <span className="value" id="authAccount">user@example.com</span>
            </div>
            <div>
              <span className="label">Member Since:</span>
              <span className="value">December 2024</span>
            </div>
            <div>
              <span className="label">Status:</span>
              <span className="value" style={{ color: 'var(--primary-orange)' }}>Premium Member</span>
            </div>
            <div>
              <span className="label">Rewards:</span>
              <span className="value">2,500 Points</span>
            </div>
            <div>
              <span className="label">Access Level:</span>
              <span className="value" style={{ color: 'var(--secondary-orange)' }}>Premium</span>
            </div>
          </div>

          <div className="premium-transaction-buttons">
            <button className="hero-btn" onClick={() => window.goToDashboard && window.goToDashboard()} style={{ padding: '16px 35px' }}>
              <i className="fas fa-tachometer-alt" /> Go to Dashboard
            </button>
            <button className="hero-btn secondary" onClick={() => window.closeAuthTransaction && window.closeAuthTransaction()} style={{ padding: '16px 35px', background: 'transparent', border: '2px solid var(--primary-orange)', color: 'var(--primary-orange)' }}>
              <i className="fas fa-check" /> Continue Exploring
            </button>
          </div>
        </div>
      </div>

      {/* Lost & Found Transaction */}
      <div className="lostfound-transaction" id="lostfoundTransaction">
        <div className="lostfound-transaction-icon">
          <i className="fas fa-search" />
        </div>
        <div className="lostfound-transaction-content">
          <h3 id="lostfoundTransactionTitle">Report Submitted!</h3>
          <p id="lostfoundTransactionText">Your lost item report has been successfully submitted to our system.</p>

          <div className="lostfound-transaction-details" id="lostfoundTransactionDetails">
            <div>
              <span className="label">Report ID:</span>
              <span className="value">LF-<span id="reportId">0000</span></span>
            </div>
            <div>
              <span className="label">Item:</span>
              <span className="value" id="reportItem">Mobile Phone</span>
            </div>
            <div>
              <span className="label">Route:</span>
              <span className="value" id="reportRoute">Colombo → Kandy</span>
            </div>
            <div>
              <span className="label">Date & Time:</span>
              <span className="value" id="reportDateTime">Today, 10:30 AM</span>
            </div>
            <div>
              <span className="label">Status:</span>
              <span className="value" style={{ color: 'var(--info-blue)', fontWeight: 700 }}>Under Investigation</span>
            </div>
          </div>

          <div className="lostfound-transaction-buttons">
            <button className="hero-btn" onClick={() => window.trackLostItem && window.trackLostItem()} style={{ padding: '16px 35px', background: 'var(--info-blue)' }}>
              <i className="fas fa-search" /> Track Report
            </button>
            <button className="hero-btn secondary" onClick={() => window.closeLostfoundTransaction && window.closeLostfoundTransaction()} style={{ padding: '16px 35px', background: 'transparent', border: '2px solid var(--info-blue)', color: 'var(--info-blue)' }}>
              <i className="fas fa-check" /> Done
            </button>
          </div>
        </div>
      </div>

      {/* Item Found Transaction */}
      <div className="itemfound-transaction" id="itemfoundTransaction">
        <div className="itemfound-transaction-icon">
          <i className="fas fa-gift" />
        </div>
        <div className="itemfound-transaction-content">
          <h3>Item Found!</h3>
          <p>Great news! An item matching your description has been found in our system.</p>

          <div className="itemfound-transaction-details" id="itemfoundTransactionDetails">
            <div>
              <span className="label">Match ID:</span>
              <span className="value">MATCH-<span id="matchId">0000</span></span>
            </div>
            <div>
              <span className="label">Item:</span>
              <span className="value" id="foundItem">iPhone 13 Pro</span>
            </div>
            <div>
              <span className="label">Found On:</span>
              <span className="value" id="foundDate">Today, 11:45 AM</span>
            </div>
            <div>
              <span className="label">Location:</span>
              <span className="value" id="foundLocation">Kandy Terminal</span>
            </div>
            <div>
              <span className="label">Contact:</span>
              <span className="value" id="foundContact">+94 77 123 4567</span>
            </div>
            <div>
              <span className="label">Status:</span>
              <span className="value" style={{ color: 'var(--success-green)', fontWeight: 700 }}>Available for Pickup</span>
            </div>
          </div>

          <div className="itemfound-transaction-buttons">
            <button className="hero-btn" onClick={() => window.contactFoundItem && window.contactFoundItem()} style={{ padding: '16px 35px', background: 'var(--success-green)' }}>
              <i className="fas fa-phone" /> Contact Now
            </button>
            <button className="hero-btn secondary" onClick={() => window.closeItemfoundTransaction && window.closeItemfoundTransaction()} style={{ padding: '16px 35px', background: 'transparent', border: '2px solid var(--success-green)', color: 'var(--success-green)' }}>
              <i className="fas fa-check" /> Done
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon"><i className="fas fa-shuttle-van" /></span>
            <span>OrangeTravel</span>
          </Link>

          <button className="mobile-menu-btn" id="mobileMenuBtn">
            <i className="fas fa-bars" />
          </button>

          <div className="nav-menu" id="navMenu">
            <Link to="/" className="active"><i className="fas fa-home" /> Home</Link>
            <Link to="/seat-booking"><i className="fas fa-chair" /> Seat Booking</Link>
            <Link to="/contact-us"><i className="fas fa-phone-alt" /> Contact Us</Link>
            <Link to="/privacy-policy"><i className="fas fa-shield-alt" /> Privacy Policy</Link>
            <Link to="/terms-conditions"><i className="fas fa-file-contract" /> Terms & Conditions</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Discover Sri Lanka with <span className="hero-highlight">Premium Comfort</span></h1>
            <p className="hero-subtitle">Experience luxury travel across Sri Lanka's most scenic routes. Our premium transport services offer unparalleled comfort, safety, and unforgettable journeys through this beautiful island.</p>

            <div className="hero-cta">
              <Link to="/seat-booking" className="hero-btn">
                <i className="fas fa-chair" /> Book Your Seat
              </Link>
              <a href="#auth-section" className="hero-btn secondary">
                <i className="fas fa-user-plus" /> Create Account
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number" data-count="25000">0</span>
                <span className="stat-label">Happy Travelers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" data-count="150">0</span>
                <span className="stat-label">Destinations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" data-count="98">0</span>
                <span className="stat-label">Satisfaction %</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" data-count="24">0</span>
                <span className="stat-label">/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Orange Travel?</h2>
          <p className="section-subtitle">We provide exceptional transport services designed for comfort, safety, and memorable experiences across Sri Lanka.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt" />
              </div>
              <h3>Premium Safety</h3>
              <p>Advanced safety systems, GPS tracking, and experienced drivers ensure your journey is secure and worry-free.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-couch" />
              </div>
              <h3>Luxury Comfort</h3>
              <p>Premium reclining seats, climate control, and onboard entertainment for maximum comfort throughout your journey.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mountain" />
              </div>
              <h3>Scenic Routes</h3>
              <p>Carefully curated routes showcasing Sri Lanka's most breathtaking landscapes and cultural landmarks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-wifi" />
              </div>
              <h3>Stay Connected</h3>
              <p>High-speed WiFi, USB charging ports, and modern amenities to keep you connected on the go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signin/Signup Section */}
      <section className="auth-section" id="auth-section">
        <div className="container">
          <h2 className="section-title">Join Our Travel Community</h2>
          <p className="section-subtitle">Create an account to book tickets faster, save preferences, and get exclusive offers.</p>

          <div className="auth-container">
            <div className="auth-welcome">
              <div className="auth-welcome-content">
                <h2>Welcome to Orange Travel</h2>
                <p>Join thousands of travelers who trust us for their Sri Lankan adventures. Create an account to unlock exclusive benefits and seamless booking experience.</p>

                <div className="auth-benefits">
                  <div className="auth-benefit">
                    <i className="fas fa-bolt" />
                    <span>Fast & Easy Booking</span>
                  </div>
                  <div className="auth-benefit">
                    <i className="fas fa-percentage" />
                    <span>Exclusive Member Discounts</span>
                  </div>
                  <div className="auth-benefit">
                    <i className="fas fa-history" />
                    <span>Booking History & Tracking</span>
                  </div>
                  <div className="auth-benefit">
                    <i className="fas fa-gift" />
                    <span>Special Offers & Rewards</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-forms">
              <div className="auth-tabs">
                <button className="auth-tab active" data-tab="signin">Sign In</button>
                <button className="auth-tab" data-tab="signup">Sign Up</button>
              </div>

              {/* Sign In Form */}
              <div className="auth-form active" id="signinForm">
                <form id="signin">
                  <div className="form-group">
                    <label htmlFor="signin-email">Email Address</label>
                    <input type="email" id="signin-email" placeholder="you@example.com" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signin-password">Password</label>
                    <input type="password" id="signin-password" placeholder="Enter your password" required />
                  </div>

                  <div className="form-options">
                    <label className="remember-me">
                      <input type="checkbox" /> Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot password?</a>
                  </div>

                  <button type="submit" className="submit-btn">
                    <i className="fas fa-sign-in-alt" /> Sign In
                  </button>
                </form>

                <div className="auth-divider"><span>or continue with</span></div>

                <div className="social-login">
                  <button className="social-btn google" onClick={() => window.socialLogin && window.socialLogin('google')}>
                    <i className="fab fa-google" /> Google
                  </button>
                  <button className="social-btn facebook" onClick={() => window.socialLogin && window.socialLogin('facebook')}>
                    <i className="fab fa-facebook-f" /> Facebook
                  </button>
                  <button className="social-btn apple" onClick={() => window.socialLogin && window.socialLogin('apple')}>
                    <i className="fab fa-apple" /> Apple
                  </button>
                </div>

                <p className="auth-footer">Don't have an account? <a href="#" className="switch-tab" data-tab="signup">Sign up</a></p>
              </div>

              {/* Sign Up Form */}
              <div className="auth-form" id="signupForm">
                <form id="signup">
                  <div className="form-group">
                    <label htmlFor="signup-name">Full Name</label>
                    <input type="text" id="signup-name" placeholder="John Doe" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-email">Email Address</label>
                    <input type="email" id="signup-email" placeholder="you@example.com" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-phone">Phone Number</label>
                    <input type="tel" id="signup-phone" placeholder="+94 77 123 4567" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input type="password" id="signup-password" placeholder="Create a strong password" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-confirm">Confirm Password</label>
                    <input type="password" id="signup-confirm" placeholder="Confirm your password" required />
                  </div>

                  <button type="submit" className="submit-btn">
                    <i className="fas fa-user-plus" /> Create Account
                  </button>
                </form>

                <div className="auth-divider"><span>or continue with</span></div>

                <div className="social-login">
                  <button className="social-btn google" onClick={() => window.socialLogin && window.socialLogin('google')}>
                    <i className="fab fa-google" /> Google
                  </button>
                  <button className="social-btn facebook" onClick={() => window.socialLogin && window.socialLogin('facebook')}>
                    <i className="fab fa-facebook-f" /> Facebook
                  </button>
                  <button className="social-btn apple" onClick={() => window.socialLogin && window.socialLogin('apple')}>
                    <i className="fab fa-apple" /> Apple
                  </button>
                </div>

                <p className="auth-footer">Already have an account? <a href="#" className="switch-tab" data-tab="signin">Sign in</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lost & Found Section */}
      <section className="lostfound-section" id="lostfound-section">
        <div className="container">
          <h2 className="section-title">Lost & Found Reporting System</h2>
          <p className="section-subtitle">Report lost items in our vehicles. Our system helps track and recover lost belongings.</p>

          <div className="lostfound-form-container">
            <div className="lostfound-form-tabs">
              <button className="lostfound-form-tab active" data-tab="report">Report Lost Item</button>
            </div>

            {/* Report Lost Item Form */}
            <div className="lostfound-form active" id="reportForm">
              <form id="lostItemReport">
                <div className="form-group">
                  <label htmlFor="item-name">Item Name</label>
                  <input type="text" id="item-name" placeholder="e.g., iPhone 13, Wallet, Backpack" required />
                </div>

                <div className="form-group">
                  <label htmlFor="item-category">Item Category</label>
                  <div className="lostfound-category">
                    <div className="category-card" data-category="electronics">
                      <i className="fas fa-mobile-alt" />
                      <h4>Electronics</h4>
                    </div>
                    <div className="category-card" data-category="documents">
                      <i className="fas fa-passport" />
                      <h4>Documents</h4>
                    </div>
                    <div className="category-card" data-category="accessories">
                      <i className="fas fa-glasses" />
                      <h4>Accessories</h4>
                    </div>
                    <div className="category-card" data-category="baggage">
                      <i className="fas fa-suitcase" />
                      <h4>Baggage</h4>
                    </div>
                  </div>
                  <input type="hidden" id="item-category" required />
                </div>

                <div className="form-group">
                  <label htmlFor="item-description">Description</label>
                  <textarea id="item-description" placeholder="Describe the item in detail (color, brand, special features, contents, etc.)" required />
                </div>

                <div className="form-group">
                  <label htmlFor="lost-route">Route</label>
                  <select id="lost-route" required>
                    <option value="">Select route</option>
                    <option value="colombo-kandy">Colombo → Kandy</option>
                    <option value="colombo-galle">Colombo → Galle</option>
                    <option value="kandy-nuwara">Kandy → Nuwara Eliya</option>
                    <option value="colombo-jaffna">Colombo → Jaffna</option>
                    <option value="galle-mirissa">Galle → Mirissa</option>
                    <option value="ella-badulla">Ella → Badulla</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="lost-date">Date Lost</label>
                  <input type="date" id="lost-date" required />
                </div>

                <div className="form-group">
                  <label htmlFor="lost-time">Approximate Time</label>
                  <input type="time" id="lost-time" required />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-name">Your Name</label>
                  <input type="text" id="contact-name" placeholder="Full name" required />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input type="email" id="contact-email" placeholder="you@example.com" required />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input type="tel" id="contact-phone" placeholder="+94 77 123 4567" required />
                </div>

                <button type="submit" className="submit-btn" style={{ background: 'var(--info-blue)' }}>
                  <i className="fas fa-search" /> Report Lost Item
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="fleet">
        <div className="container">
          <h2 className="section-title">Our Premium Fleet</h2>
          <p className="section-subtitle">Travel in comfort with our modern fleet designed for safety and luxury.</p>

          <div className="fleet-grid">
            <div className="fleet-card">
              <div className="fleet-image">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Luxury Bus" />
              </div>
              <div className="fleet-content">
                <h3>Luxury Coaches</h3>
                <div className="fleet-features">
                  <span><i className="fas fa-couch" /> Premium Seats</span>
                  <span><i className="fas fa-wifi" /> Free WiFi</span>
                  <span><i className="fas fa-snowflake" /> AC</span>
                  <span><i className="fas fa-plug" /> Charging</span>
                  <span><i className="fas fa-tv" /> Entertainment</span>
                  <span><i className="fas fa-utensils" /> Refreshments</span>
                </div>
                <Link to="/seat-booking" className="hero-btn" style={{ fontSize: 15, padding: '14px 35px', textDecoration: 'none', display: 'inline-block' }}>
                  <i className="fas fa-ticket-alt" /> Book Now
                </Link>
              </div>
            </div>

            <div className="fleet-card">
              <div className="fleet-image">
                <img src="https://ichef.bbci.co.uk/images/ic/1024xn/p0dmqnyd.jpg.webp" alt="Modern Train" />
              </div>
              <div className="fleet-content">
                <h3>Modern Trains</h3>
                <div className="fleet-features">
                  <span><i className="fas fa-mountain" /> Panoramic Views</span>
                  <span><i className="fas fa-chair" /> First Class</span>
                  <span><i className="fas fa-camera" /> Photo Stops</span>
                  <span><i className="fas fa-concierge-bell" /> Service</span>
                  <span><i className="fas fa-guide" /> Guides</span>
                  <span><i className="fas fa-luggage-cart" /> Luggage</span>
                </div>
                <Link to="/seat-booking" className="hero-btn" style={{ fontSize: 15, padding: '14px 35px', textDecoration: 'none', display: 'inline-block' }}>
                  <i className="fas fa-ticket-alt" /> Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Traveler Experiences</h2>
          <p className="section-subtitle">Hear from travelers who have explored Sri Lanka with Orange.</p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">"The journey from Colombo to Ella was absolutely breathtaking. The comfort and service made our family trip unforgettable."</div>
              <div className="testimonial-author">
                <div className="author-avatar">SJ</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>UK Traveler</p>
                  <div className="rating"><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /></div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">"As a frequent traveler, Orange Travel has set a new standard for comfort and reliability in Sri Lanka."</div>
              <div className="testimonial-author">
                <div className="author-avatar">MA</div>
                <div className="author-info">
                  <h4>Michael Anderson</h4>
                  <p>Business Executive</p>
                  <div className="rating"><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star-half-alt" /></div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">"Perfect for family travel. The children loved the entertainment, and we appreciated the safety features."</div>
              <div className="testimonial-author">
                <div className="author-avatar">RP</div>
                <div className="author-info">
                  <h4>Rajesh & Priya</h4>
                  <p>Family Travelers</p>
                  <div className="rating"><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <p>© 2024 OrangeTravel Sri Lanka. All rights reserved. | Premium Transport Services</p>
            <p style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>This site is protected by reCAPTCHA and the Google <a href="#" style={{ color: 'var(--primary-orange)' }}>Privacy Policy</a> and <a href="#" style={{ color: 'var(--primary-orange)' }}>Terms of Service</a> apply.</p>
          </div>
        </div>
      </footer>

      {/* Quick Action Button */}
      <div className="quick-action-btn">
        <div className="quick-action-toggle" id="quickActionToggle" onClick={() => { const w = window; if (w) { w.quickActionToggleClicked = true; /* UI toggling handled in effect */ } }}>
          <i className="fas fa-bolt" />
          <div className="notification-badge">3</div>
        </div>
        <div className="quick-action-window" id="quickActionWindow">
          <div className="quick-action-header">
            <h3><i className="fas fa-bolt" /> Quick Actions</h3>
            <button className="close-quick-action" id="closeQuickAction">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="quick-action-body">
            <div className="quick-action-grid">
              <Link to="/seat-booking" className="quick-action-item orange" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fas fa-chair" />
                <h4>Book Your Seat</h4>
                <p>Fast seat booking with premium options</p>
              </Link>

              <a href="#lostfound-section" className="quick-action-item purple" onClick={() => window.showLostFoundReport && window.showLostFoundReport()} style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fas fa-search" />
                <h4>Report Lost Item</h4>
                <p>Lost something? Report it here</p>
              </a>

              <Link to="/contact-us" className="quick-action-item teal" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fas fa-headset" />
                <h4>24/7 Support</h4>
                <p>Get immediate assistance</p>
              </Link>

              <div className="quick-action-item orange" onClick={() => window.showItemFoundTransaction && window.showItemFoundTransaction()}>
                <i className="fas fa-gift" />
                <h4>Check Found Items</h4>
                <p>Search for your lost items</p>
              </div>

              <div className="quick-action-item blue" onClick={() => window.scrollToAuth && window.scrollToAuth()}>
                <i className="fas fa-user-plus" />
                <h4>Create Account</h4>
                <p>Join premium membership</p>
              </div>

              <Link to="/privacy-policy" className="quick-action-item teal" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fas fa-shield-alt" />
                <h4>Privacy Policy</h4>
                <p>View our privacy policy</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <div className="ai-chatbot">
        <div className="chatbot-toggle" id="chatbotToggle">
          <i className="fas fa-robot" />
          <div className="notification-badge">1</div>
        </div>
        <div className="chatbot-window" id="chatbotWindow">
          <div className="chat-header">
            <div>
              <h3><i className="fas fa-robot" /> Orange Assistant</h3>
              <div className="chatbot-status">
                <span className="status-dot" />
                <span>Online</span>
              </div>
            </div>
            <button className="close-chat" id="closeChat">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="chat-body" id="chatBody">
            <div className="chat-message bot-message">
              <div className="message-avatar"><i className="fas fa-robot" /></div>
              <div className="message-content">Hello! I'm your Orange Travel Assistant 🍊 How can I help you plan your Sri Lanka journey today?<div className="message-time">Just now</div></div>
            </div>
            <div className="quick-replies" id="quickReplies">
              <div className="quick-reply" data-reply="Book seat">Book seat</div>
              <div className="quick-reply" data-reply="Schedule info">Schedule info</div>
              <div className="quick-reply" data-reply="Lost item report">Lost item report</div>
              <div className="quick-reply" data-reply="Contact support">Contact support</div>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" id="chatInput" placeholder="Type your question..." />
            <button className="send-button" id="sendMessage"><i className="fas fa-paper-plane" /></button>
          </div>
        </div>
      </div>
    </>
  );
}

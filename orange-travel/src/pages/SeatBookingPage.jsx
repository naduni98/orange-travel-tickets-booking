import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/SeatBooking.css';

export default function SeatBookingPage() {
  const [journeyType, setJourneyType] = useState('single');
  const [vehicleType, setVehicleType] = useState('bus');
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [trainClass, setTrainClass] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [legs, setLegs] = useState([
    { start: '', destination: '', date: todayStr, time: '', passengers: 1, seats: [], transport: 'bus', trainClass: null },
    { start: '', destination: '', date: todayStr, time: '', passengers: 1, seats: [], transport: 'bus', trainClass: null }
  ]);
  const [multiPassengers, setMultiPassengers] = useState(1);

  const addLeg = () => setLegs(prev => [...prev, { start: '', destination: '', date: todayStr, time: '', passengers: multiPassengers, seats: [], transport: 'bus', trainClass: null }]);
  const updateLeg = (idx, patch) => setLegs(prev => prev.map((l,i) => i === idx ? { ...l, ...patch } : l));
  const removeLeg = (idx) => setLegs(prev => prev.filter((_,i) => i !== idx));
  const setAllLegsPassengers = (n) => { setMultiPassengers(n); setLegs(prev => prev.map(l => ({ ...l, passengers: n }))); };

  const getSeatRowsForLeg = (legIndex) => {
    const leg = legs[legIndex];
    const transport = leg?.transport || 'bus';
    const rngSeed = (leg.start + '|' + leg.destination + '|' + transport + '|' + legIndex).split('').reduce((acc,c)=>acc+ c.charCodeAt(0), 0) % 1000;
    const rng = (rngSeed % 100)/100;
    const rows = transport === 'train' ? 8 : 4;
    const seatsPerSide = transport === 'train' ? 3 : 4;
    const arr = [];
    for (let r = 1; r <= rows; r++) {
      const left = [];
      const right = [];
      for (let s = 1; s <= seatsPerSide; s++) {
        const seatNum = (r - 1) * seatsPerSide * 2 + s;
        const rand = Math.abs(Math.sin((rng * 1000) + seatNum));
        left.push({ seatNum, type: (s === 1 || s === seatsPerSide) ? 'window' : (s === 2 || s === seatsPerSide - 1) ? 'aisle' : 'normal', booked: (rand % 1) < 0.25 });
      }
      for (let s = 1; s <= seatsPerSide; s++) {
        const seatNum = (r - 1) * seatsPerSide * 2 + seatsPerSide + s;
        const rand = Math.abs(Math.sin((rng * 2000) + seatNum));
        right.push({ seatNum, type: (s === 1 || s === seatsPerSide) ? 'window' : (s === 2 || s === seatsPerSide - 1) ? 'aisle' : 'normal', booked: (rand % 1) < 0.25 });
      }
      arr.push({ label: r, left, right });
    }
    return arr;
  };

  const handleLegSeatClick = (legIndex, seat) => {
    if (seat.booked) return;
    setLegs(prev => prev.map((l, i)=>{
      if (i !== legIndex) return l;
      const selected = new Set(l.seats || []);
      if (selected.has(seat.seatNum)) selected.delete(seat.seatNum);
      else {
        if ((selected.size) >= multiPassengers) { alert(`You can only select ${multiPassengers} seat(s) for ${multiPassengers} passenger(s) in Leg ${legIndex+1}.`); return l; }
        selected.add(seat.seatNum);
      }
      return { ...l, seats: Array.from(selected) };
    }));
  };
  const seatSeed = useMemo(() => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < vehicleType.length; i++) { h = Math.imul(h ^ vehicleType.charCodeAt(i), 16777619) >>> 0; }
    return (h % 100000) / 100000;
  }, [vehicleType]);

  useEffect(() => {
    const cleanupFns = [];

    const indexShapes = document.getElementById('indexShapes');
    const shapeCount = 15;
    const luxuryCount = 5;

    if (indexShapes) {
      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.className = 'index-shape';
        const size = Math.random() * 150 + 30;
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
        const size = Math.random() * 250 + 80;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${Math.random() * 30 + 20}s`;
        shape.style.animationDelay = `${Math.random() * 3}s`;
        shape.style.opacity = Math.random() * 0.15 + 0.05;
        indexShapes.appendChild(shape);
      }

      cleanupFns.push(() => { while (indexShapes.firstChild) indexShapes.removeChild(indexShapes.firstChild); });
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
    cleanupFns.push(() => mobileMenuBtn?.removeEventListener('click', mobileHandler));

    const outsideClick = (e) => {
      if (!navMenu || !mobileMenuBtn) return;
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    };

    document.addEventListener('click', outsideClick);
    cleanupFns.push(() => document.removeEventListener('click', outsideClick));

    const today = new Date().toISOString().split('T')[0];
    const singleDate = document.getElementById('single-date');
    if (singleDate) {
      singleDate.min = today;
      singleDate.value = today;
    }

    window.scrollToMultiLeg = () => {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        setJourneyType('multi');
        setLegs(prev => prev.length >= 2 ? prev : [
          { start: '', destination: '', date: todayStr, time: '', passengers: multiPassengers, seats: [], transport: 'bus', trainClass: null },
          { start: '', destination: '', date: todayStr, time: '', passengers: multiPassengers, seats: [], transport: 'bus', trainClass: null }
        ]);
      }, 300);
    };

    window.showProfileModal = () => {
      const userProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        bookings: [
          { id: 1, route: 'Colombo → Kandy', date: '2024-01-15' },
          { id: 2, route: 'Kandy → Galle', date: '2024-01-20' }
        ]
      };

      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease;
      `;
      
      modal.innerHTML = `
        <div style="background: var(--glass-bg); backdrop-filter: blur(30px); border-radius: var(--radius-md); padding: 40px; max-width: 500px; width: 100%; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); position: relative;">
          <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--primary-orange); font-size: 24px; cursor: pointer;">
            <i class="fas fa-times"></i>
          </button>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, var(--purple) 0%, #8e44ad 100%); color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">
              <i class="fas fa-user"></i>
            </div>
            <h2 style="color: var(--dark-gray); margin-bottom: 10px;">My Profile</h2>
            <p style="color: var(--text-gray); font-size: 14px;">Manage your account and preferences</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm); padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255, 107, 53, 0.1);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                <i class="fas fa-user"></i>
              </div>
              <div>
                <h3 style="color: var(--dark-gray); margin-bottom: 5px;">${userProfile.name}</h3>
                <p style="color: var(--text-gray); font-size: 14px;">Premium Member</p>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px;">
              <span style="color: var(--text-gray);">Email:</span>
              <span style="color: var(--dark-gray); font-weight: 600;">${userProfile.email}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px;">
              <span style="color: var(--text-gray);">Phone:</span>
              <span style="color: var(--dark-gray); font-weight: 600;">${userProfile.phone}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span style="color: var(--text-gray);">Total Bookings:</span>
              <span style="color: var(--primary-orange); font-weight: 600;">${userProfile.bookings.length}</span>
            </div>
          </div>
          
          <div style="display: flex; gap: 15px;">
            <button onclick="window.showBookingHistory && window.showBookingHistory()" style="flex: 1; background: linear-gradient(135deg, var(--teal) 0%, #16a085 100%); color: white; border: none; border-radius: var(--radius-sm); padding: 12px; font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; transition: var(--transition);">
              <i class="fas fa-history"></i> History
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="flex: 1; background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%); color: white; border: none; border-radius: var(--radius-sm); padding: 12px; font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; transition: var(--transition);">
              <i class="fas fa-sign-out-alt"></i> Close
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      if (!document.getElementById('profile-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'profile-modal-styles';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    };
    window.showBookingHistory = () => {
      const userProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        bookings: [
          { transactionId: 'TXN-1001', journeyType: 'Colombo → Kandy', bookingTime: '2024-01-15T10:00:00Z', totalPrice: 2500 },
          { transactionId: 'TXN-1002', journeyType: 'Kandy → Galle', bookingTime: '2024-01-20T14:30:00Z', totalPrice: 1800 }
        ]
      };

      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease;
      `;

      let bookingsHTML = '';
      if (userProfile.bookings.length > 0) {
        bookingsHTML = userProfile.bookings.map(booking => `
          <div style="background: rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm); padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255, 107, 53, 0.1);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
              <span style="color: var(--text-gray);">Transaction ID:</span>
              <span style="color: var(--primary-orange); font-weight: 600;">${booking.transactionId}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
              <span style="color: var(--text-gray);">Journey:</span>
              <span style="color: var(--dark-gray); font-weight: 600;">${booking.journeyType}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
              <span style="color: var(--text-gray);">Date:</span>
              <span style="color: var(--dark-gray); font-weight: 600;">${new Date(booking.bookingTime).toLocaleDateString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span style="color: var(--text-gray);">Amount:</span>
              <span style="color: var(--primary-orange); font-weight: 600;">LKR ${booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        `).join('');
      } else {
        bookingsHTML = `
          <div style="text-align: center; padding: 30px; color: var(--text-gray); font-size: 14px;">
            <i class="fas fa-history" style="font-size: 48px; margin-bottom: 15px; color: var(--light-gray);"></i>
            <p>No booking history yet</p>
            <p style="font-size: 12px; margin-top: 10px;">Your bookings will appear here</p>
          </div>
        `;
      }

      modal.innerHTML = `
        <div style="background: var(--glass-bg); backdrop-filter: blur(30px); border-radius: var(--radius-md); padding: 40px; max-width: 500px; width: 100%; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); position: relative; max-height: 80vh; overflow-y: auto;">
          <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--primary-orange); font-size: 24px; cursor: pointer;">
            <i class="fas fa-times"></i>
          </button>

          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, var(--teal) 0%, #16a085 100%); color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">
              <i class="fas fa-history"></i>
            </div>
            <h2 style="color: var(--dark-gray); margin-bottom: 10px;">Booking History</h2>
            <p style="color: var(--text-gray); font-size: 14px;">View all your past bookings</p>
          </div>

          <div style="margin-bottom: 25px;">
            ${bookingsHTML}
          </div>

          <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%); color: white; border: none; border-radius: var(--radius-sm); padding: 12px; font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; transition: var(--transition);">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      if (!document.getElementById('profile-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'profile-modal-styles';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    };
    window.showSupportModal = () => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease;
      `;

      modal.innerHTML = `
        <div style="background: var(--glass-bg); backdrop-filter: blur(30px); border-radius: var(--radius-md); padding: 40px; max-width: 500px; width: 100%; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); position: relative;">
          <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--primary-orange); font-size: 24px; cursor: pointer;">
            <i class="fas fa-times"></i>
          </button>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, var(--info-blue) 0%, #2980b9 100%); color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">
              <i class="fas fa-headset"></i>
            </div>
            <h2 style="color: var(--dark-gray); margin-bottom: 10px;">24/7 Support</h2>
            <p style="color: var(--text-gray); font-size: 14px;">We're here to help you anytime</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm); padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255, 107, 53, 0.1);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--success-green) 0%, #27ae60 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                <i class="fas fa-phone"></i>
              </div>
              <div>
                <h3 style="color: var(--dark-gray); margin-bottom: 5px; font-size: 16px;">Call Us</h3>
                <p style="color: var(--primary-orange); font-weight: 600; font-size: 18px;">+94 11 234 5678</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--warning-yellow) 0%, #d35400 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                <i class="fas fa-envelope"></i>
              </div>
              <div>
                <h3 style="color: var(--dark-gray); margin-bottom: 5px; font-size: 16px;">Email Us</h3>
                <p style="color: var(--primary-orange); font-weight: 600; font-size: 16px;">support@orangetravel.lk</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--purple) 0%, #8e44ad 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                <i class="fab fa-whatsapp"></i>
              </div>
              <div>
                <h3 style="color: var(--dark-gray); margin-bottom: 5px; font-size: 16px;">WhatsApp</h3>
                <p style="color: var(--primary-orange); font-weight: 600; font-size: 16px;">+94 77 123 4567</p>
              </div>
            </div>
          </div>
          
          <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%); color: white; border: none; border-radius: var(--radius-sm); padding: 12px; font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; transition: var(--transition);">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      `;
      
      document.body.appendChild(modal);

      if (!document.getElementById('profile-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'profile-modal-styles';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    };

    window.confirmBooking = () => {
      const seats = Array.from(document.querySelectorAll('.seat.selected')).map(s => s.dataset.seatNumber);
      if (!seats.length) {
        alert('Please select at least one seat before confirming.');
        return;
      }
      alert(`Booking confirmed for seats: ${seats.join(', ')}`);
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      const handler = (e) => {
        if (anchor.getAttribute('href') !== '#') {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          target && target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      anchor.addEventListener('click', handler);
      cleanupFns.push(() => anchor.removeEventListener('click', handler));
    });

    return () => { cleanupFns.forEach(fn => fn()); };
  }, [multiPassengers, todayStr]);


  const seatRowsMemo = useMemo(() => {
    const rng = seatSeed || 0.5;
    const rows = vehicleType === 'train' ? 8 : 4;
    const seatsPerSide = vehicleType === 'train' ? 3 : 4;
    const arr = [];
    for (let r = 1; r <= rows; r++) {
      const left = [];
      const right = [];
      for (let s = 1; s <= seatsPerSide; s++) {
        const seatNum = (r - 1) * seatsPerSide * 2 + s;
        const rand = Math.abs(Math.sin((rng * 1000) + seatNum));
        left.push({ seatNum, type: (s === 1 || s === seatsPerSide) ? 'window' : (s === 2 || s === seatsPerSide - 1) ? 'aisle' : 'normal', booked: (rand % 1) < 0.25 });
      }
      for (let s = 1; s <= seatsPerSide; s++) {
        const seatNum = (r - 1) * seatsPerSide * 2 + seatsPerSide + s;
        const rand = Math.abs(Math.sin((rng * 2000) + seatNum));
        right.push({ seatNum, type: (s === 1 || s === seatsPerSide) ? 'window' : (s === 2 || s === seatsPerSide - 1) ? 'aisle' : 'normal', booked: (rand % 1) < 0.25 });
      }
      arr.push({ label: r, left, right });
    }
    return arr;
  }, [seatSeed, vehicleType]);

  const showSeatmap = Boolean(startPoint && destination);

  const togglePreference = (pref) => {
    setPreferences(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  const handleSeatClick = (seat) => {
    if (seat.booked) return;
    setSelectedSeats(prev => {
      if (prev.includes(seat.seatNum)) {
        return prev.filter(s => s !== seat.seatNum);
      }
      if (prev.length >= passengers) {
        alert(`You can only select ${passengers} seat(s) for ${passengers} passenger(s).`);
        return prev;
      }
      return [...prev, seat.seatNum];
    });
  };

  const totalPrice = useMemo(() => {
    let base = 0;
    if (startPoint && destination) {
      base = 2000;
      const s = startPoint.toLowerCase();
      const d = destination.toLowerCase();
      if (s.includes('colombo') || d.includes('colombo')) {
        if (d.includes('kandy') || s.includes('kandy')) base = 2500;
        else if (d.includes('galle') || s.includes('galle')) base = 1800;
        else if (d.includes('jaffna') || s.includes('jaffna')) base = 3500;
      }
      if (vehicleType === 'train') { base *= 1.3; const premiums = { first: 1500, second: 800, third: 0 }; base += (trainClass ? premiums[trainClass] || 0 : 0); }
    }
    base *= passengers;
    let prefCost = 0;
    const prices = { 'seat-window': 200, 'seat-aisle': 150, 'seat-extra': 500, 'comfort-ac': 800, 'comfort-quiet': 300 };
    preferences.forEach(p => { prefCost += (prices[p] || 0) * passengers; });
    return Math.round(base + prefCost);
  }, [startPoint, destination, vehicleType, passengers, preferences, trainClass]);

  const timeLabels = {
    morning: 'Morning (6:00 AM - 8:00 AM)',
    'mid-morning': 'Mid Morning (9:00 AM - 11:00 AM)',
    afternoon: 'Afternoon (1:00 PM - 3:00 PM)',
    evening: 'Evening (5:00 PM - 7:00 PM)',
    night: 'Night (9:00 PM - 11:00 PM)'
  };

  const confirmBooking = useCallback(() => {
    if (journeyType === 'single') {
      if (!startPoint || !destination) { alert('Please enter both starting point and destination.'); return; }
      if (!time) { alert('Please select a preferred time.'); return; }
      if (vehicleType === 'train' && !trainClass) { alert('Please select a train class.'); return; }
      if (selectedSeats.length === 0) { alert('Please select at least one seat.'); return; }
      if (selectedSeats.length !== passengers) { alert(`Please select exactly ${passengers} seat(s).`); return; }
      alert(`Booking confirmed for seats: ${selectedSeats.join(', ')} • Total: LKR ${totalPrice.toLocaleString()}`);
      return;
    }

    // Multi-leg booking handling
    // basic validation for legs
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      if (!leg.start || !leg.destination) { alert(`Please fill start and destination for leg ${i + 1}`); return; }
      if (!leg.date) { alert(`Please select a date for leg ${i + 1}`); return; }
      if (!leg.time) { alert(`Please select a time for leg ${i + 1}`); return; }
      if (!leg.transport) { alert(`Please select transport for leg ${i + 1}`); return; }
      if (leg.transport === 'train' && !leg.trainClass) { alert(`Please select train class for leg ${i + 1}`); return; }
      if (!leg.seats || leg.seats.length === 0) { alert(`Please select seats for leg ${i + 1}`); return; }
      if (leg.seats.length !== multiPassengers) { alert(`Please select exactly ${multiPassengers} seat(s) for ${multiPassengers} passenger(s) in Leg ${i+1}.`); return; }
    }

    const booking = { type: 'multi', legs: legs.map(l => ({ ...l })) };
    console.log('Multi-leg booking confirmed', booking);
    alert('Multi-leg booking confirmed! Check console for details.');
  }, [journeyType, startPoint, destination, time, vehicleType, trainClass, selectedSeats, passengers, totalPrice, legs, multiPassengers]);

  useEffect(() => { window.confirmBooking = () => confirmBooking(); return () => { if (window.confirmBooking) delete window.confirmBooking; } }, [confirmBooking]);

  return (
    <>
      <div className="bg-visual" />
      <div className="index-shapes" id="indexShapes" />

      <div className="user-profile-touch">
        <div className="profile-touch-btn profile" onClick={() => window.showProfileModal && window.showProfileModal()}>
          <i className="fas fa-user" />
          <span className="touch-tooltip">My Profile</span>
        </div>
        <div className="profile-touch-btn history" onClick={() => window.showBookingHistory && window.showBookingHistory()}>
          <i className="fas fa-history" />
          <span className="touch-tooltip">Booking History</span>
        </div>
        <div className="profile-touch-btn support" onClick={() => window.showSupportModal && window.showSupportModal()}>
          <i className="fas fa-headset" />
          <span className="touch-tooltip">24/7 Support</span>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo"><span className="logo-icon"><i className="fas fa-shuttle-van" /></span><span>OrangeTravel</span></Link>
          <button className="mobile-menu-btn" id="mobileMenuBtn"><i className="fas fa-bars" /></button>
          <div className="nav-menu" id="navMenu">
            <Link to="/"> <i className="fas fa-home" /> Home</Link>
            <Link to="/seat-booking" className="active"><i className="fas fa-chair" /> Seat Booking</Link>
            <Link to="/contact-us"><i className="fas fa-phone-alt" /> Contact Us</Link>
            <Link to="/privacy-policy"><i className="fas fa-shield-alt" /> Privacy Policy</Link>
            <Link to="/terms-conditions"><i className="fas fa-file-contract" /> Terms & Conditions</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1><span className="hero-highlight">Premium</span> Seat Booking</h1>
            <p className="hero-subtitle">Book single journeys or multi-leg trips with real-time seat selection and personalized preferences.</p>
            <div className="hero-cta">
              <a href="#booking-section" className="hero-btn"><i className="fas fa-chair" /> Book Now</a>
              <a href="#booking-section" className="hero-btn secondary" onClick={() => window.scrollToMultiLeg && window.scrollToMultiLeg()}><i className="fas fa-route" /> Multi-Leg Journey</a>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-section" id="booking-section">
        <div className="container">
          <h2 className="section-title">Book Your Journey</h2>
          <p className="section-subtitle">Choose between single trip or multi-leg journey with seamless connections.</p>

          <div className="booking-tabs">
            <button className={`booking-tab ${journeyType==='single'?'active':''}`} onClick={() => { setJourneyType('single'); document.getElementById('journeyTimeline') && (document.getElementById('journeyTimeline').style.display = 'none'); }}>Single Journey</button>
            <button className={`booking-tab ${journeyType==='multi'?'active':''}`} onClick={() => { setJourneyType('multi'); document.getElementById('journeyTimeline') && (document.getElementById('journeyTimeline').style.display = 'block'); }}>Multi-Leg Journey</button>
          </div>

          <div className="booking-container">
            <div className="booking-main">
              <div className={`booking-tab-content ${journeyType==='single'?'active':''}`} id="single-tab">
                <div className="booking-form">
                  <div className="form-group">
                    <label><i className="fas fa-route" /> Select Your Route</label>
                    <div className="route-inputs">
                      <div className="route-input-group">
                        <i className="fas fa-map-marker-alt" />
                        <input type="text" id="single-start" placeholder="Starting Point" required value={startPoint} onChange={e => setStartPoint(e.target.value)} />
                      </div>
                      <div className="route-input-group">
                        <i className="fas fa-map-pin" />
                        <input type="text" id="single-destination" placeholder="Destination" required value={destination} onChange={e => setDestination(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="journey-type">
                    <button type="button" className={`journey-type-btn ${vehicleType==='bus'?'active':''}`} data-type="bus" onClick={() => { setVehicleType('bus'); setTrainClass(null); setSelectedSeats([]); }}><i className="fas fa-bus" /><span>Bus</span><small>Luxury coaches</small></button>
                    <button type="button" className={`journey-type-btn ${vehicleType==='train'?'active':''}`} data-type="train" onClick={() => { setVehicleType('train'); setSelectedSeats([]); }}><i className="fas fa-train" /><span>Train</span><small>Scenic routes</small></button>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-calendar-alt" /> Travel Date</label>
                    <input type="date" id="single-date" required min={todayStr} value={date} onChange={e => setDate(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-clock" /> Preferred Time</label>
                    <select id="single-time" required value={time} onChange={e => setTime(e.target.value)}>
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (6:00 AM - 8:00 AM)</option>
                      <option value="mid-morning">Mid Morning (9:00 AM - 11:00 AM)</option>
                      <option value="afternoon">Afternoon (1:00 PM - 3:00 PM)</option>
                      <option value="evening">Evening (5:00 PM - 7:00 PM)</option>
                      <option value="night">Night (9:00 PM - 11:00 PM)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-users" /> Number of Passengers</label>
                    <select id="single-passengers" required value={passengers} onChange={e => { setPassengers(parseInt(e.target.value)); setSelectedSeats([]); }}>
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5">5 Passengers</option>
                      <option value="6">6 Passengers (Group)</option>
                    </select>
                  </div>
                </div>

                <div className={`train-class-panel ${vehicleType==='train'?'active':''}`} id="singleTrainClassPanel">
                  <h3><i className="fas fa-ticket-alt" /> Select Train Class</h3>
                  <div className="class-options">
                    <div className={`class-option ${trainClass==='first'?'selected':''}`} data-class="first" onClick={() => setTrainClass('first')}><i className="fas fa-crown class-icon first-class" /><h4>First Class</h4><div className="class-price">+LKR 1,500</div></div>
                    <div className={`class-option ${trainClass==='second'?'selected':''}`} data-class="second" onClick={() => setTrainClass('second')}><i className="fas fa-user-tie class-icon second-class" /><h4>Second Class</h4><div className="class-price">+LKR 800</div></div>
                    <div className={`class-option ${trainClass==='third'?'selected':''}`} data-class="third" onClick={() => setTrainClass('third')}><i className="fas fa-chair class-icon third-class" /><h4>Third Class</h4><div className="class-price">Base Price</div></div>
                  </div>

                  <div className="third-class-note"><i className="fas fa-exclamation-triangle" /><span>Third class does not include air conditioning and has limited comfort features.</span></div>
                </div>

                <div className={`seatmap-panel ${showSeatmap ? 'active' : ''}`} id="seatmapPanel">
                  <h3><i className="fas fa-map" /> Real-Time Seat Map</h3>
                  <div className="seatmap-header">
                    <div className="seatmap-leg-info">
                      <span className="leg-indicator" id="seatmapTitle">{vehicleType === 'train' ? `Train: ${startPoint || 'Enter Starting Point'} → ${destination || 'Enter Destination'}` : `Bus: ${startPoint || 'Enter Starting Point'} → ${destination || 'Enter Destination'}`}</span>
                      <span style={{color:'var(--text-gray)', fontSize:13}} id="seatmapSubtitle">{vehicleType === 'train' ? 'Select a carriage • Departs: 08:30 AM' : 'Premium Bus • Depart: 08:30 AM'}</span>
                    </div>
                  </div>

                  <div className="seatmap-legend"> ... </div>

                  <div className="seatmap-grid">
                    <div className="driver-section" id="seatmapDriverSection">{vehicleType === 'train' ? 'Engine' : 'Driver'}</div>
                    <div className="seats-container" id="seatsContainer">
                      {showSeatmap ? seatRowsMemo.map(row => (
                        <div className="seat-row" key={row.label}>
                          <div style={{width:30, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, color:'var(--dark-gray)'}}>{row.label}</div>
                          {row.left.map(seat => (
                            <div key={seat.seatNum} className={`seat ${seat.type} ${seat.booked ? 'booked' : ''} ${selectedSeats.includes(seat.seatNum) ? 'selected' : ''}`} onClick={() => handleSeatClick(seat)}>{seat.seatNum}</div>
                          ))}
                          <div className="aisle-space" />
                          {row.right.map(seat => (
                            <div key={seat.seatNum} className={`seat ${seat.type} ${seat.booked ? 'booked' : ''} ${selectedSeats.includes(seat.seatNum) ? 'selected' : ''}`} onClick={() => handleSeatClick(seat)}>{seat.seatNum}</div>
                          ))}
                        </div>
                      )) : null}
                    </div>
                  </div>

                  <div className="seat-nav-buttons">
                    <div style={{color:'var(--text-gray)', fontSize:13}}><i className="fas fa-info-circle" /> Click to select seats</div>
                    <div style={{color:'var(--text-gray)', fontSize:13}}>Selected: <span id="selectedCount">{selectedSeats.length}</span> seats</div>
                  </div>
                </div>

                <div className="preferences-panel">
                  <h3><i className="fas fa-user-cog" /> Travel Preferences</h3>
                  <div className="preferences-grid">
                    <div className="preference-card">
                      <h4><i className="fas fa-chair" /> Seat Preferences</h4>
                      <div className="preference-options">
                        <div className={`preference-option ${preferences.includes('seat-window') ? 'selected' : ''}`} data-pref="seat-window" onClick={() => togglePreference('seat-window')}><div className="option-info"><i className="fas fa-window-maximize" /><span>Window Seat</span></div><div className="option-price">+LKR 200</div></div>
                        <div className={`preference-option ${preferences.includes('seat-aisle') ? 'selected' : ''}`} data-pref="seat-aisle" onClick={() => togglePreference('seat-aisle')}><div className="option-info"><i className="fas fa-door-open" /><span>Aisle Seat</span></div><div className="option-price">+LKR 150</div></div>
                        <div className={`preference-option ${preferences.includes('seat-extra') ? 'selected' : ''}`} data-pref="seat-extra" onClick={() => togglePreference('seat-extra')}><div className="option-info"><i className="fas fa-arrows-alt-h" /><span>Extra Legroom</span></div><div className="option-price">+LKR 500</div></div>
                      </div>
                    </div>

                    <div className="preference-card">
                      <h4><i className="fas fa-snowflake" /> Comfort & AC</h4>
                      <div className="preference-options">
                        <div className={`preference-option ${preferences.includes('comfort-ac') ? 'selected' : ''}`} data-pref="comfort-ac" onClick={() => togglePreference('comfort-ac')}><div className="option-info"><i className="fas fa-snowflake" /><span>AC Cabin Only</span></div><div className="option-price">+LKR 800</div></div>
                        <div className={`preference-option ${preferences.includes('comfort-quiet') ? 'selected' : ''}`} data-pref="comfort-quiet" onClick={() => togglePreference('comfort-quiet')}><div className="option-info"><i className="fas fa-volume-mute" /><span>Quiet Coach</span></div><div className="option-price">+LKR 300</div></div>
                        <div className={`preference-option ${preferences.includes('comfort-family') ? 'selected' : ''}`} data-pref="comfort-family" onClick={() => togglePreference('comfort-family')}><div className="option-info"><i className="fas fa-users" /><span>Family Section</span></div><div className="option-price">Free</div></div>
                      </div>
                    </div>
                  </div>

                  <div className="save-profile" onClick={() => window.savePreferences && window.savePreferences()}>
                    <i className="fas fa-save" />
                    <span>Save these preferences to my profile</span>
                  </div>
                </div>

              </div>

              <div className={`booking-tab-content ${journeyType==='multi'?'active':''}`} id="multi-tab">
                <div className="multi-leg-form">
                  <p style={{color:'var(--text-gray)'}}><i className="fas fa-info-circle" style={{color:'var(--info-blue)'}} /> Book multiple connections (bus → train → bus) in one ticket with safe transfer times.</p>
                  <div className="multi-leg-passengers">
                    <div className="passengers-input-group">
                      <label><i className="fas fa-users" /><span>Number of Passengers for all legs:</span></label>
                      <div className="passenger-selector">
                        <button className="passenger-btn" onClick={() => setAllLegsPassengers(Math.max(1, multiPassengers - 1))}>-</button>
                        <span className="passenger-count">{multiPassengers}</span>
                        <button className="passenger-btn" onClick={() => setAllLegsPassengers(Math.min(10, multiPassengers + 1))}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="legs-container">
                    {legs.map((leg, idx) => (
                      <div className="leg-card" key={idx} data-leg={idx+1}>
                        <div className="leg-header">
                          <h4><span className="leg-number">{idx+1}</span> {['First Leg','Second Leg','Additional Leg'][idx] || 'Additional Leg'}</h4>
                          <button className="remove-leg-btn" onClick={() => removeLeg(idx)} disabled={legs.length <= 2}>Remove</button>
                        </div>

                        <div className="leg-route-inputs">
                          <div className="route-input-group">
                            <i className="fas fa-map-marker-alt" />
                            <input type="text" value={leg.start} onChange={e => updateLeg(idx, { start: e.target.value })} placeholder="Starting Point" />
                          </div>
                          <div className="route-input-group">
                            <i className="fas fa-map-pin" />
                            <input type="text" value={leg.destination} onChange={e => updateLeg(idx, { destination: e.target.value })} placeholder="Destination" />
                          </div>
                        </div>

                        <div className="leg-options">
                          <div className={`leg-option ${leg.transport === 'bus' ? 'selected' : ''}`} onClick={() => updateLeg(idx, { transport: 'bus', trainClass: null })}>
                            <div className="option-header">
                              <div className="transport-type"><i className="fas fa-bus" /> <span>Premium Bus</span></div>
                              <div className="duration">3h 15m</div>
                            </div>
                            <div className="option-details"><span className="leg-route-display">{leg.start && leg.destination ? `${leg.start} → ${leg.destination}` : 'Enter route'}</span><span>08:30 AM</span></div>
                            <div className="option-price">LKR 2,500</div>
                          </div>

                          <div className={`leg-option ${leg.transport === 'train' ? 'selected' : ''}`} onClick={() => updateLeg(idx, { transport: 'train' })}>
                            <div className="option-header">
                              <div className="transport-type"><i className="fas fa-train" /> <span>Express Train</span></div>
                              <div className="duration">2h 45m</div>
                            </div>
                            <div className="option-details"><span className="leg-route-display">{leg.start && leg.destination ? `${leg.start} → ${leg.destination}` : 'Enter route'}</span><span>09:00 AM</span></div>
                            <div className="option-price">LKR 3,200</div>
                          </div>
                        </div>

                        {leg.transport === 'train' ? (
                          <div className={`leg-train-class ${leg.transport === 'train' ? 'active' : ''}`} id={`leg-train-class-${idx}`}>
                            <h4 style={{color:'var(--dark-gray)', marginBottom:15, display:'flex', alignItems:'center', gap:10}}><i className="fas fa-ticket-alt" style={{color:'var(--primary-orange)'}}></i> Select Train Class for Leg {idx+1}</h4>
                            <div className="class-options" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
                              <div className={`class-option ${leg.trainClass === 'first' ? 'selected' : ''}`} onClick={() => updateLeg(idx, { trainClass: 'first' })}><i className="fas fa-crown class-icon first-class" /><h4 style={{fontSize:16}}>First Class</h4><div className="class-price">+LKR 1,500</div></div>
                              <div className={`class-option ${leg.trainClass === 'second' ? 'selected' : ''}`} onClick={() => updateLeg(idx, { trainClass: 'second' })}><i className="fas fa-user-tie class-icon second-class" /><h4 style={{fontSize:16}}>Second Class</h4><div className="class-price">+LKR 800</div></div>
                              <div className={`class-option ${leg.trainClass === 'third' ? 'selected' : ''}`} onClick={() => updateLeg(idx, { trainClass: 'third' })}><i className="fas fa-chair class-icon third-class" /><h4 style={{fontSize:16}}>Third Class</h4><div className="class-price">Base Price</div></div>
                            </div>
                          </div>
                        ) : null}

                        <div className="form-group">
                          <label>Travel Date</label>
                          <input type="date" value={leg.date} min={todayStr} onChange={e => updateLeg(idx, { date: e.target.value })} />
                        </div>

                        <div className="form-group">
                          <label>Preferred Time</label>
                          <select value={leg.time} onChange={e => updateLeg(idx, { time: e.target.value })}>
                            <option value="">Select time slot</option>
                            <option value="morning">Morning (6:00 AM - 8:00 AM)</option>
                            <option value="mid-morning">Mid Morning (9:00 AM - 11:00 AM)</option>
                            <option value="afternoon">Afternoon (1:00 PM - 3:00 PM)</option>
                            <option value="evening">Evening (5:00 PM - 7:00 PM)</option>
                            <option value="night">Night (9:00 PM - 11:00 PM)</option>
                          </select>
                        </div>

                        {leg.start && leg.destination ? (
                          <div className={`leg-seat-arrangements active`} id={`seat-arrangement-${idx+1}`}>
                            <div className="seat-arrangement-header">
                              <h4><i className="fas fa-chair" /> Leg {idx+1}: {leg.start} → {leg.destination}</h4>
                              {idx+1 > 2 ? <button className="remove-leg-btn" onClick={() => removeLeg(idx)}><i className="fas fa-trash" /> Remove Leg</button> : null}
                            </div>

                            <div className="seat-arrangement-container">
                              <div className="driver-section">{leg.transport === 'train' ? 'Engine' : 'Driver'}</div>
                              <div className="seats-container" data-leg={idx+1}>
                                {getSeatRowsForLeg(idx).map(row => (
                                  <div className="seat-row" key={`leg${idx}-row${row.label}`}>
                                    <div style={{width:30, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, color:'var(--dark-gray)'}}>{row.label}</div>
                                    {row.left.map(seat => (
                                      <div key={seat.seatNum} className={`seat ${seat.type} ${seat.booked ? 'booked' : ''} ${leg.seats.includes(seat.seatNum) ? 'selected' : ''}`} onClick={() => handleLegSeatClick(idx, seat)}>{seat.seatNum}</div>
                                    ))}

                                    <div className="aisle-space" />

                                    {row.right.map(seat => (
                                      <div key={seat.seatNum} className={`seat ${seat.type} ${seat.booked ? 'booked' : ''} ${leg.seats.includes(seat.seatNum) ? 'selected' : ''}`} onClick={() => handleLegSeatClick(idx, seat)}>{seat.seatNum}</div>
                                    ))}
                                  </div>
                                ))}
                              </div>

                              <div className="seat-nav-buttons">
                                <div style={{color:'var(--text-gray)', fontSize:13}}><i className="fas fa-info-circle" /> Click to select seats for this leg</div>
                                <div style={{color:'var(--text-gray)', fontSize:13}}>Selected: <span className="leg-selected-count">{leg.seats.length}</span> seats</div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                      </div>
                    ))}

                    <button className="add-leg-btn" onClick={addLeg}><i className="fas fa-plus" /> Add Another Leg</button>
                  </div>
                </div>

                <div id="multiLegSeatArrangements"></div>
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-header"><h3><i className="fas fa-receipt" /> Booking Summary</h3><p style={{color:'var(--text-gray)'}}>Review your journey details</p></div>
              <div className="summary-timeline" id="journeyTimeline" style={{display: journeyType === 'multi' ? 'block' : 'none'}}>
                <div className="timeline-line"></div>
                <div className="timeline-stops" id="timelineStops">{journeyType === 'multi' ? legs.map((l, i) => (<div key={i} className="timeline-stop">{l.start || 'Start'} → {l.destination || 'Destination'}</div>)) : null}</div>
              </div>

              <div className="summary-details">
                <div className="detail-item"><span className="detail-label">Journey Type:</span><span className="detail-value" id="summary-type">{journeyType === 'single' ? 'Single Trip' : 'Multi-Leg Journey'}</span></div>
                <div className="detail-item"><span className="detail-label">Route:</span><span className="detail-value" id="summary-route">{journeyType === 'single' ? (startPoint && destination ? `${startPoint} → ${destination}` : 'Not entered') : (legs && legs.length ? legs.map((l,i)=> (l.start && l.destination) ? `${l.start} → ${l.destination}` : `Leg ${i+1}`).join(' → ') : 'Not selected')}</span></div>
                <div className="detail-item"><span className="detail-label">Transport:</span><span className="detail-value" id="summary-transport">{journeyType === 'single' ? (vehicleType === 'train' ? 'Train' : 'Bus') : (legs && legs.length ? legs.map(l => l.transport === 'train' ? 'Train' : 'Bus').join(' • ') : 'Not selected')}</span></div>
                <div className="detail-item"><span className="detail-label">Date:</span><span className="detail-value" id="summary-date">{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not selected'}</span></div>
                <div className="detail-item"><span className="detail-label">Time:</span><span className="detail-value" id="summary-time">{time ? timeLabels[time] : 'Not selected'}</span></div>
                <div className="detail-item"><span className="detail-label">Passengers:</span><span className="detail-value" id="summary-passengers">{journeyType === 'single' ? passengers : multiPassengers}</span></div>
                <div className="detail-item"><span className="detail-label">Seats:</span><span className="detail-value" id="summary-seats">{journeyType === 'single' ? (selectedSeats.length > 0 ? selectedSeats.sort((a,b)=>a-b).join(', ') : 'Not selected') : (legs.length ? 'Per-leg selection' : 'Not selected')}</span></div>
                <div className="detail-item" id="train-class-summary" style={{display: vehicleType==='train' ? 'flex' : 'none'}}><span className="detail-label">Train Class:</span><span className="detail-value" id="summary-train-class">{trainClass ? ({'first':'First Class','second':'Second Class','third':'Third Class'}[trainClass]) : 'Not selected'}</span></div>
                <div className="detail-item"><span className="detail-label">Preferences:</span><span className="detail-value" id="summary-prefs">{preferences.length > 0 ? preferences.map(p => ({'seat-window':'Window Seat','seat-aisle':'Aisle Seat','seat-extra':'Extra Legroom','comfort-ac':'AC Cabin','comfort-quiet':'Quiet Coach','comfort-family':'Family Section'})[p]).join(', ') : 'None'}</span></div>
              </div>

              <div className="summary-total"><div className="total-label">Total Amount</div><div className="total-amount" id="totalAmount">LKR {totalPrice.toLocaleString()}</div></div>
              <button className="submit-btn" onClick={confirmBooking}><i className="fas fa-ticket-alt" /> Confirm & Book Now</button>
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
    </>
  );
}

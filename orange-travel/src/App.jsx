import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SeatBooking from "./pages/SeatBooking";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      </Routes>
    </BrowserRouter>
  );
}

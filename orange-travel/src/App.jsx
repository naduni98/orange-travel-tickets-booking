import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/HomePage";
import SeatBooking from "./pages/SeatBookingPage";
import ContactUs from "./pages/ContactUsPage";
import PrivacyPolicy from "./pages/PrivacyPolicyPage";
import TermsConditions from "./pages/TermsConditionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
      </Routes>
    </BrowserRouter>
  );
}

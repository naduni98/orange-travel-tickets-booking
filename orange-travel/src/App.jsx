import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SeatBooking from "./pages/SeatBooking";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
 
      </Routes>
    </BrowserRouter>
  );
}

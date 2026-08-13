import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Komik from "../pages/Komik";

export default function MyRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="komik/:komikId" element={<Komik />} />
    </Routes>
  );
}

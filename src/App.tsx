import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

export default function App() {
  return (
    <>
      <div>
        <Navbar />
        <Outlet />
        <Footer/>
      </div>
    </>
  );
}

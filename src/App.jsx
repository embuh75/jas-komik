import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./components/MyRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <MyRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

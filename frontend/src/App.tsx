import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AuthInitializer from "./components/AuthInitializer/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-16 flex-1">
          <Outlet />
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthInitializer>
  );
}

export default App;

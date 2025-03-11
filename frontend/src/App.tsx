import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Header from "./common/Header/Header";
import CreateTask from "./pages/CreateTask";
import TaskDashboard from "./pages/TaskDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Header />
        <Routes>
          <Route path="/" element={<TaskDashboard />} />
            <Route path="/createTask" element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

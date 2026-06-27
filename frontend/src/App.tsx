import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Protected from "./routes/ProtectedRoute";
import TasksPage from "./pages/tasks/TasksPage";
import TaskDetails from "./pages/tasks/TaskDetails";
import EditTask from "./pages/tasks/EditTask";
import CreateTask from "./pages/tasks/CreateTask";
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            {/* Flatten these routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            <Route path="/dashboard" element={
              <Protected><Dashboard /></Protected>
            } />

            <Route path="/profile" element={
              <Protected><Profile /></Protected>
            } />

            <Route path="/tasks" element={
              <Protected><TasksPage /></Protected>
            } />

            <Route path="/tasks/create" element={
              <Protected><CreateTask /></Protected>
            } />

            <Route path="/tasks/:id" element={
              <Protected><TaskDetails /></Protected>
            } />

            <Route path="/tasks/edit/:id" element={
              <Protected><EditTask /></Protected>
            }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
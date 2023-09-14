import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./signin";
import Home from "./home";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import SignUp from "./signup";
import Dashboard from "./dashboard/Dashboard";

export default function App() {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth loginPath="signin">
                <Home />
              </RequireAuth>
            }
          ></Route>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

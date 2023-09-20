import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./signin";
import Home from "./home";
import Users from "./users";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import SignUp from "./signup";

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
          {/* Unprotected routes */}
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <RequireAuth loginPath="signin">
                <Home />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="users"
            element={
              <RequireAuth loginPath="../signin">
                <Users />
              </RequireAuth>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// const container = document.getElementById("root");
// const root = ReactDOM.createRoot(container!);
// root.render(<App />);

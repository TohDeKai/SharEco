import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./signin";
import Home from "./home";
import Users from "./users";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import SignUp from "./signup";
import Rental from "./rental";
import Business from "./business";
import Listing from "./listings";
import Transaction from "./transactions";
import Overview from "./overview";

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
            path="rental"
            element={
              <RequireAuth loginPath="../signin">
                <Rental />
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

          <Route
            path="businesses"
            element={
              <RequireAuth loginPath="../signin">
                <Business />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="listings"
            element={
              <RequireAuth loginPath="../signin">
                <Listing />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="transactions"
            element={
              <RequireAuth loginPath="../signin">
                <Transaction />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="overview"
            element={
              <RequireAuth loginPath="../signin">
                <Overview />
              </RequireAuth>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

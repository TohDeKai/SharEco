import React from "react";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState(" ");
  const [password, setPassword] = useState(" ");

  const handleLogin = async () => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response !== null) {
        window.location.href = "/home";
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <div>
        <form className="form">
          <h1>Admin Login</h1>
          <label>
            Username:
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button onClick={handleLogin}>Sign In</button>
          <br />
          Need an Account?
          <span>
            <button>Sign Up</button>
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;

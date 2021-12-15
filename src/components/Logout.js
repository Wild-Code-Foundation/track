import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import usePersistedState from "use-persisted-state-hook";

const LogoutButton = () => {
  const [auth, setAuth] = usePersistedState("auth", {
    isAuthenticated: false,
    token: null,
  });
  const { logout } = useAuth0();

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      token: null,
    })
    logout({ returnTo: window.location.origin })
  }

  return (
    <button onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
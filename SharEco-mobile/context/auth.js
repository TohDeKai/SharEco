import {
  router,
  useSegments,
  useRouter,
  useRootNavigationState,
} from "expo-router";
import React from "react";
import { AsyncStorage } from "react-native";

const AuthContext = React.createContext();

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    console.log("user", user);

    // If user not signed in and the initial segment is not anything in the auth group.
    if (!user && !inAuthGroup) {
      // Redirect to the login page.
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // If user is signed in, redirect away from the login page.
      router.replace("/");
    }
  }, [user, segments, navigationState]);
}

export function Provider(props) {
  const [user, setAuth] = React.useState(null);

  useProtectedRoute(user);

  // store user session data
  const storeUserData = async (user) => {
    try {
      const userDataString = JSON.stringify(user);
      await AsyncStorage.setItem("user", userDataString);
    } catch (error) {
      console.log("Error storing user data: ", error);
    }
  };

  // remove user session data
  const removeUserSessionData = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log("Error removing user data: ", error);
    }
  };

  const signIn = (email, password) => {
    setAuth({ email, password });
    storeUserData({ email, password });
    console.log("user email signIn here ", email);
    console.log("Signed in with: " + user);
  };

  const signOut = () => {
    setAuth(null);
    removeUserSessionData();
    console.log("Signed out");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

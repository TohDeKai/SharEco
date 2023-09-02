import { router, useSegments, useRouter, useRootNavigationState } from 'expo-router';
import React from 'react';

const AuthContext = React.createContext(null);

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

  return (
    <AuthContext.Provider
      value={{
        signIn: () => setAuth({}),
        signOut: () => setAuth(null),
        user,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
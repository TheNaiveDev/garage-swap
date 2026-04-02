  import { Outlet, Navigate } from "react-router-dom";
  import { supabase } from "../lib/supabaseClient";
  import { useEffect, useState } from "react";

  const ProtectedRoute = () => {
    let [user, setUser] = useState<boolean | null>(null);

    useEffect(() => {
      async function checkUser() {
        const { data } = await supabase.auth.getSession();
        if (data.session !== null) {
          setUser(true);
        } else {
          setUser(false);
        }
      }
      checkUser();
    }, []);
    if (user === null) {
      return <div>Loading...</div>
    }
    return user ? <Outlet /> : <Navigate to="/sign-in" />;
  };

  export default ProtectedRoute;

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => {
  return [
    { title: "Resume Analyzer | Auth" },
    { name: "description", content: "Log into your account" },
  ];
};

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}images/bg-main.svg")`,
      }}
    >
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1> Welcome</h1>
            <h2> Log In to Continue your Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button " onClick={auth.signOut}>
                    Log out
                  </button>
                ) : (
                  <button className="auth-button " onClick={auth.signIn}>
                    Signing In
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;

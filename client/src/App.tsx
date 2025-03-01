import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SideNav } from "@/components/SideNav";
import { MainPlayer } from "@/components/MainPlayer";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle } from "./lib/firebase";
import { Button } from "./components/ui/button";

import Home from "@/pages/home";
import Search from "@/pages/search";
import PlaylistPage from "@/pages/playlist";
import NotFound from "@/pages/not-found";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Music Stream</h1>
          <Button onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <MainPlayer videoId="" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/playlist/:id" component={PlaylistPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthCheck>
        <Layout>
          <Router />
        </Layout>
      </AuthCheck>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
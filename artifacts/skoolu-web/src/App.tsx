import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { ThemeProvider } from 'next-themes';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  Redirect
} from 'wouter';

// Pages
import Home from '@/pages/home';
import SchoolDetail from '@/pages/school-detail';
import Favorites from '@/pages/favorites';
import Chat from '@/pages/chat';
import Alerts from '@/pages/alerts';
import Profile from '@/pages/profile';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import Onboarding from '@/pages/onboarding';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, path }: { component: any, path: string }) {
  const { user } = useApp();
  
  // Actually, for this app Guest users are logged in too, 
  // so we just check isLoggedIn
  if (!user.isLoggedIn) {
    return <Redirect to="/login" />;
  }
  
  return <Route path={path} component={Component} />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <AppShell>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          
          <ProtectedRoute path="/onboarding" component={Onboarding} />
          <ProtectedRoute path="/" component={Home} />
          <ProtectedRoute path="/schools/:id" component={SchoolDetail} />
          <ProtectedRoute path="/favorites" component={Favorites} />
          <ProtectedRoute path="/chat" component={Chat} />
          <ProtectedRoute path="/alerts" component={Alerts} />
          <ProtectedRoute path="/profile" component={Profile} />
          
          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AppProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import WelcomeScreen from '@/components/WelcomeScreen';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

type Screen = 'welcome' | 'auth';

function AppContent() {
  const { session, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-sunset-400" />
      </div>
    );
  }

  if (session) {
    return <Dashboard />;
  }

  if (screen === 'auth') {
    return (
      <>
        <WelcomeScreen
          onGetStarted={() => {
            setAuthMode('signup');
            setScreen('auth');
          }}
          onLogIn={() => {
            setAuthMode('login');
            setScreen('auth');
          }}
        />
        <AuthScreen
          mode={authMode}
          onClose={() => setScreen('welcome')}
          onSuccess={() => setScreen('welcome')}
        />
      </>
    );
  }

  return (
    <WelcomeScreen
      onGetStarted={() => {
        setAuthMode('signup');
        setScreen('auth');
      }}
      onLogIn={() => {
        setAuthMode('login');
        setScreen('auth');
      }}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

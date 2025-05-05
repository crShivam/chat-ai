import { LoginForm } from '../components/auth/login-form';
import { useEffect, useState } from 'react';

export default function Auth() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="w-full max-w-md transition-all duration-500 ease-in-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.98)',
        }}
      >
        <LoginForm />
      </div>
    </div>
  );
}

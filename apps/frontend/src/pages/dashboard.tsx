import { useAuth } from '@/contexts/auth-context';
import Loader from '@/components/common/loader';
import { Navbar } from '@/components/common/Navbar';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Add subtle animation when component mounts
  useEffect(() => {
    // Small delay to ensure CSS transitions work properly
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </main>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <Navbar />
      <main className="flex flex-col w-full p-4">
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '200ms',
          }}
        >
          Hello
        </div>
      </main>
    </div>
  );
}

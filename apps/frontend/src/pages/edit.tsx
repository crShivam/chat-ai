import Loader from "@/components/common/loader";
import Navbar from "@/components/common/Navbar";
import EditNoteForm from "@/components/notes/EditNoteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";


export default function EditNote() {
  const { isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      <main className="flex flex-col w-full max-w-5xl mx-auto px-4 lg:px-0 items-center py-4 transition-all duration-500 ease-in-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "200ms",
        }}
      >
          <EditNoteForm />
      </main>
    </div>
  );
} 
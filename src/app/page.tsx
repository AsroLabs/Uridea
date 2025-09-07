"use client";

import { useEffect, useState } from "react";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-09-19T00:00:00");

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 py-4 border-b border-gray-200 gap-4 sm:gap-0">
        <h1 className="text-xl font-extrabold text-gray-900">
          <span className="text-blue-600">ASRO</span> Brainstorm
        </h1>
        <div className="flex gap-3 sm:gap-4">
          <a
            href="/auth"
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Iniciar Sesión
          </a>
          <a
            href="/auth/register"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Crear Cuenta
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20 flex-1">
        <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-gray-900 max-w-3xl">
          Brainstorming <span className="text-blue-600">Colaborativo</span> en Tiempo Real
        </h2>
        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl">
          La plataforma definitiva para equipos creativos. Organiza, valida y comparte
          ideas en un espacio privado y seguro.
        </p>

        {/* Contador con sombra sutil */}
        <div className="mt-10 grid grid-cols-2 sm:flex sm:gap-6 gap-4">
          {[
            { label: "Días", value: timeLeft.days },
            { label: "Horas", value: timeLeft.hours },
            { label: "Minutos", value: timeLeft.minutes },
            { label: "Segundos", value: timeLeft.seconds },
          ].map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center bg-white rounded-lg shadow-lg shadow-blue-200/50 px-4 py-3 sm:px-6 sm:py-4 transition-transform hover:scale-105"
            >
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                {unit.value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">{unit.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <a
            href="/auth/register"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-center"
          >
            Comenzar Gratis →
          </a>
          <a
            href="/auth"
            className="px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition text-center"
          >
            Ver Demo
          </a>
        </div>
      </section>
    </div>
  );
}

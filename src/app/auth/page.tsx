"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import GoogleSignIn from "./components/ui/GoogleSignIn";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.push("/menu");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-xl transform transition">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Bienvenido
          </h2>

          <p className="text-center text-sm text-gray-500 mt-2">
            Ingresa a tu cuenta para continuar
          </p>

          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary font-semibold border-none shadow-md"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <div className="divider">o</div>

          <GoogleSignIn />

          <p className="text-sm text-center mt-4 text-gray-600">
            ¿No tienes cuenta?{" "}
            <a href="/auth/register" className="link text-blue-600 font-semibold">
              Crear cuenta
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

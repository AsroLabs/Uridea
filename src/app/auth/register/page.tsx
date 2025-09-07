"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
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
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      router.push("/auth?message=Check your email to confirm your account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-xl transform transition duration-500 hover:scale-105">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Crear cuenta
          </h2>

          <p className="text-center text-sm text-gray-500 mt-2">
            Únete a nuestra plataforma
          </p>

          {error && (
            <div className="alert alert-error text-sm text-center mt-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="input input-bordered w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input input-bordered w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-blue-600 text-white font-semibold border-none shadow-md transform transition duration-300 hover:scale-105"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="divider">o</div>

          <button className="btn btn-outline w-full text-gray-700 border-gray-300 hover:bg-gray-100 transition transform duration-300 hover:scale-105">
            Registrarse con Google
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <a href="/auth" className="link text-blue-600 font-semibold">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

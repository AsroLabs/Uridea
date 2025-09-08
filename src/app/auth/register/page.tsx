"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/auth/service";
import { ROUTES } from "@/utils/auth/constants";

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

    const { success, error: signUpError } = await authService.signUp({
      email,
      password,
      fullName
    });

    if (!success && signUpError) {
      setError(signUpError);
    } else {
      router.push(`${ROUTES.AUTH}?message=Por favor, revisa tu correo para confirmar tu cuenta`);
    }
    
    setLoading(false);
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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
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

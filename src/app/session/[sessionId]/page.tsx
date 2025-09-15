"use client";

import { useParams, useRouter } from 'next/navigation';
import UserCard from "../components/ui/UserCard";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Session() {
  const router = useRouter();


  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      router.push("/menu");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  }
  const { sessionId } = useParams()


  useEffect(() => {
    async function loadSessionData() {
      const supabase = createClient();
      
      // Verificar si la sesión existe y está activa
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('status', 'active')
        .single();

      if (sessionError || !session) {
        console.error('Error al cargar la sesión:', sessionError);
        router.push('/menu');
        return;
      } else console.log('Te has unido a la sesión:', session);

      // Obtener participantes activos
      const { data: participants, error: participantsError } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId)
        .eq('status', 'active');

      if (participantsError) {
        console.error('Error al cargar participantes:', participantsError);
        return;
      }

      if (!participants || participants.length === 0) {
        console.error('No hay participantes activos');
        router.push('/menu');
        return;
      } else console.log('Participantes activos:', participants);
    }

    if (sessionId) {
      loadSessionData();
    }
  }, [])

  return (
    <>
      <header className="navbar bg-base-300 rounded-b-2xl px-3 sm:px-4 md:px-6 w-full max-w-[100vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
        <div className="flex-1">
          <a className="text-base sm:text-lg md:text-xl lg:text-2xl text-black">Uridea</a>
        </div>
        <div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-square btn-ghost ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-48 sm:w-56 p-2 shadow-lg text-sm sm:text-base">
              <li><a className="py-3">Settings</a></li>
              <li><button className="py-3" onClick={handleLogout}>Quit</button></li>
            </ul>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 sm:gap-8 place-items-center mx-20 my-10">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </main>
    </>
  )
}


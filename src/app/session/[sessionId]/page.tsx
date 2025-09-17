"use client";

import { useParams, useRouter } from 'next/navigation';
import UserCard from "../components/ui/UserCard";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import CreateIdeaButton from '../components/ui/CreateIdeaButton';
import { useUser } from '@/hooks/useUser';

interface Participant {
  id: string;
  session_id: string;
  user_id: string;
  status: 'active';
  full_name?: string | null;
  isOwner?: boolean;
  ideaPermission?: boolean;
}

export default function Session() {
  const router = useRouter();
  const { sessionId } = useParams();
  const { user } = useUser();
  // const [session, setSession] = useState<null>(null); // No necesitamos el estado de la sesión por ahora
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      router.push("/menu");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  }

  useEffect(() => {
    const supabase = createClient();
    
    async function loadSessionData() {
      try {
        setIsLoading(true);
        
        // 1. Verificar si la sesión existe y está activa
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
        }

        // 2. Obtener participantes activos con sus datos de usuario
        const { data: participantsData, error: participantsError } = await supabase
          .from('session_participants')
          .select("*")
          .eq('session_id', sessionId)
          .eq('status', 'active');

        if (participantsError) {
          console.error('Error al cargar participantes:', participantsError);
          return;
        }

        if (!participantsData || participantsData.length === 0) {
          console.error('No hay participantes activos');
          router.push('/menu');
          return;
        }
        
        // Transformar los datos al formato correcto
        const formattedParticipants = await Promise.all(participantsData.map(async p => {

          return {
            id: p.id,
            session_id: p.session_id,
            user_id: p.user_id,
            status: p.status as 'active',
            full_name: p.username,
            isOwner: p.isOwner,
            ideaPermission: p.ideaPermission
          };
        }));

        setParticipants(formattedParticipants);
      } catch (error) {
        console.error('Error loading session data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Cargar datos iniciales
    if (sessionId) {
      loadSessionData();
    }

    // Suscribirse a cambios en participantes
    const channel = supabase
      .channel(`session_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload) => {
          console.log('Participant change:', payload);
          // Recargar participantes cuando hay cambios
          loadSessionData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, router]);

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

      <div className="max-w-[100vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 mt-6">
        <CreateIdeaButton
          canCreateIdea={participants.find(p => p.user_id === user?.id)?.ideaPermission || false}
          onClick={() => {
            // TODO: Implementar creación de idea
            console.log('Crear nueva idea');
          }}
        />
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 sm:gap-8 place-items-center mx-20 my-10">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 10 }).map((_, i) => (
            <UserCard key={`skeleton-${i}`} isLoading={true} />
          ))
        ) : participants.length > 0 ? (
          // Mostrar participantes
          participants.map((participant) => (
            <UserCard
              key={participant.id}
              fullName={participant.full_name || undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-base-content/70">No hay participantes activos</p>
          </div>
        )}
      </main>
    </>
  )
}


"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import UserCard from "../components/ui/UserCard";
import CreateIdeaButton from '../components/ui/CreateIdeaButton';

interface Idea {
  id: string;
  title: string;
  description: string;
  session_id: string;
  user_id: string;
  created_at: string;
  status: 'active' | 'draft';
}

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
  const [ideas, setIdeas] = useState<Idea[]>([]);
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

        // 3. Obtener ideas activas
        const { data: ideasData, error: ideasError } = await supabase
          .from('ideas')
          .select('*')
          .eq('session_id', sessionId)
          .eq('status', 'draft');

        if (ideasError) {
          console.error('Error al cargar ideas:', ideasError);
          return;
        } else console.info(ideasData); 
        
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
        setIdeas(ideasData || []);

      } catch (error) {
        console.error('Error loading session data:', error);
        router.push('/menu');
      } finally {
        setIsLoading(false);
      }
    }

    // Cargar datos iniciales
    if (sessionId) {
      loadSessionData();
    }

    // Suscribirse a cambios en participantes e ideas
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
          loadSessionData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload) => {
          console.log('Idea change:', payload);
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
            const modal = document.getElementById('createIdeaModal') as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
        />
        <dialog id="createIdeaModal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Nueva Idea</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const title = formData.get('title') as string;
              const description = formData.get('description') as string;

              if (!title || !description) return;

              const supabase = createClient();
              
              try {
                const { error } = await supabase
                  .from('ideas')
                  .insert({
                    title: title.trim(),
                    description: description.trim(),
                    session_id: sessionId,
                    user_id: user?.id,
                    status: 'draft'
                  });

                if (error) throw error;

                // Cerrar modal y limpiar form
                const modal = document.getElementById('createIdeaModal') as HTMLDialogElement;
                modal?.close();
                form.reset();
              } catch (error) {
                console.error('Error al crear idea:', error);
              }
            }}>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Título</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="¿Cuál es tu idea?" 
                  className="input input-bordered w-full"
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <textarea 
                  name="description"
                  placeholder="Describe tu idea en detalle..." 
                  className="textarea textarea-bordered h-24"
                  required
                  maxLength={500}
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => {
                  const modal = document.getElementById('createIdeaModal') as HTMLDialogElement;
                  modal?.close();
                }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear Idea</button>
              </div>
            </form>
          </div>
        </dialog>

        
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 sm:gap-8 place-items-center mx-20 my-10">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 10 }).map((_, i) => (
            <UserCard key={`skeleton-${i}`} user_id="" isLoading={true} />
          ))
        ) : participants.length > 0 ? (
          // Mostrar participantes
          participants.map((participant) => {
            const userIdeas = ideas.filter(idea => idea.user_id === participant.user_id);
            return (
              <UserCard
                key={participant.id}
                user_id={participant.user_id}
                fullName={participant.full_name || undefined}
                hasIdeas={userIdeas.length > 0}
                userIdeas={userIdeas}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-base-content/70">No hay participantes activos</p>
          </div>
        )}
      </main>
    </>
  )
}


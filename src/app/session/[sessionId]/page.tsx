"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import useRealtimeSession from '@/hooks/useSession';
import { useIdeas } from '@/hooks/useIdeas';
import { useCreateIdea } from '@/hooks/useCreateIdea';
import { getUserIdeasForParticipant } from '@/utils/idea';
import UserCard from "../components/ui/UserCard";
import CreateIdeaButton from '../components/ui/CreateIdeaButton';

export default function Session() {
  const router = useRouter();
  const { sessionId } = useParams();
  const { user } = useUser();

  const { participants, session, isLoading: isSessionLoading, endSession, updateParticipantStatus } = useRealtimeSession({
    sessionId: sessionId as string,
    userId: user?.id as string
  });

  const { ideas, isLoading: isIdeasLoading, handleRateIdea, handleManageIdea } = useIdeas({
    sessionId: sessionId as string,
    userId: user?.id
  });

  const { handleCreateIdea } = useCreateIdea({
    sessionId: sessionId as string,
    userId: user?.id,
    onSuccess: () => {
      const modal = document.getElementById('createIdeaModal') as HTMLDialogElement;
      modal?.close();
    }
  });

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const is_owner = participants.find(p => p.user_id === user?.id)?.is_owner || false;
      
      if (is_owner) {
        // If owner, end session before redirecting
        await endSession();
      } else updateParticipantStatus('ended');
      
      router.push("/menu");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  }

  // Listen for session status changes
  useEffect(() => {
    if (session?.status === 'ended') {
      router.push("/menu");
    }
  }, [session?.status, router]);

  const isLoading = isSessionLoading || isIdeasLoading;

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
            <form onSubmit={handleCreateIdea}>
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
            const userIdeas = getUserIdeasForParticipant(ideas, participant.user_id);
            return (
              <UserCard
                key={participant.id}
                user_id={participant.user_id}
                fullName={participant.full_name || undefined}
                hasIdeas={userIdeas.length > 0}
                userIdeas={userIdeas}
                is_owner={participants.find(p => p.user_id === user?.id)?.is_owner || false}
                onRateIdea={handleRateIdea}
                onManageIdea={handleManageIdea}
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


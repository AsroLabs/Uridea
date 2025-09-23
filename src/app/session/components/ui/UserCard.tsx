interface Idea {
    id: string;
    title: string;
    description: string;
    session_id: string;
    user_id: string;
    created_at: string;
    status: 'saved' | 'draft' | 'discarded';
    likes: number;
    dislikes: number;
}

interface UserCardProps {
    fullName?: string;
    user_id: string;
    hasIdeas?: boolean;
    isLoading?: boolean;
    userIdeas?: Idea[];
    currentUserId?: string;
    is_owner?: boolean;
    onRateIdea?: (ideaId: string, action: 'like' | 'dislike') => void;
    onManageIdea?: (ideaId: string, action: 'save' | 'discard') => void;
}

export default function UserCard({ 
    fullName, 
    user_id, 
    hasIdeas = false, 
    isLoading = false, 
    userIdeas = [],
    is_owner = false,
    onRateIdea,
    onManageIdea 
}: UserCardProps) {
    const handleRate = (ideaId: string, action: 'like' | 'dislike') => (e: React.MouseEvent) => {
        e.stopPropagation();
        onRateIdea?.(ideaId, action);
    };
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-4 w-20"></div>
                    </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
            </div>
        );
    }

    const handleShowIdeas = () => {
        const modal = document.getElementById(`userIdeasModal-${user_id}`) as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    return (
        <>
            <div 
                className="flex flex-col gap-4 p-4 bg-base-200 rounded-xl shadow-lg w-full max-w-xs cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={handleShowIdeas}
            >
                <div className="flex items-center gap-4">
                    <div className={`avatar placeholder ${hasIdeas ? 'avatar-online ring ring-primary ring-offset-base-100 ring-offset-2' : ''}`}>
                        <div className="bg-neutral text-neutral-content rounded-full w-16">
                            <span className="text-xl">{fullName?.[0]?.toUpperCase() || 'U'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">{fullName || 'Usuario'}</span>
                        {hasIdeas && (
                            <span className="text-sm text-primary">Ha compartido ideas</span>
                        )}
                    </div>
                </div>
            </div>

            <dialog id={`userIdeasModal-${user_id}`} className="modal">
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg mb-4">Ideas de {fullName || 'Usuario'}</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {userIdeas.length > 0 ? (
                            userIdeas.map((idea) => (
                                                                <div key={idea.id} className="card bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <h2 className="card-title">{idea.title}</h2>
                                        <p>{idea.description}</p>
                                        <div className="card-actions justify-between items-center mt-4">
                                            <div className="flex gap-4 items-center">
                                                <button 
                                                    className={`btn btn-sm gap-2 ${
                                                        idea.likes > 0 ? 'btn-primary' : 'btn-ghost'
                                                    }`}
                                                    onClick={handleRate(idea.id, 'like')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                    </svg>
                                                    <span>{idea.likes || 0}</span>
                                                </button>
                                                <button 
                                                    className={`btn btn-sm gap-2 ${
                                                        idea.dislikes > 0 ? 'btn-error' : 'btn-ghost'
                                                    }`}
                                                    onClick={handleRate(idea.id, 'dislike')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 0h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5" />
                                                    </svg>
                                                    <span>{idea.dislikes || 0}</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {is_owner && (
                                                    <div className="dropdown dropdown-end">
                                                        <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                                                        </div>
                                                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                            <li>
                                                                <button 
                                                                    className="text-success"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onManageIdea?.(idea.id, 'save');
                                                                    }}
                                                                >
                                                                    Guardar idea
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="text-error"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onManageIdea?.(idea.id, 'discard');
                                                                    }}
                                                                >
                                                                    Descartar idea
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                                <span className="text-sm text-base-content/60">
                                                    {new Date(idea.created_at).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-base-content/70">No hay ideas compartidas aún</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cerrar</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

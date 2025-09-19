interface Idea {
    id: string;
    title: string;
    description: string;
    session_id: string;
    user_id: string;
    created_at: string;
    status: 'active' | 'draft';
}

interface UserCardProps {
    fullName?: string;
    user_id: string;
    hasIdeas?: boolean;
    isLoading?: boolean;
    userIdeas?: Idea[];
}

export default function UserCard({ fullName, user_id, hasIdeas = false, isLoading = false, userIdeas = [] }: UserCardProps) {
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
                                        <div className="card-actions justify-end">
                                            <span className="text-sm text-base-content/60">
                                                {new Date(idea.created_at).toLocaleDateString('es-ES')}
                                            </span>
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

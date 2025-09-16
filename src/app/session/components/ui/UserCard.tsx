interface UserCardProps {
    fullName?: string;

    isLoading?: boolean;
}

export default function UserCard({ fullName, isLoading = false }: UserCardProps) {
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

    return (
        <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-xl shadow-lg w-full max-w-xs">
            <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-16">

                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{fullName || 'Usuario'}</span>
                </div>
            </div>
        </div>
    )
}

interface CardProps {
    title: string
    subtitle?: string
    onClick?: () => void
}

export default function Card({ title = "Sesión", subtitle, onClick }: CardProps) {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 w-full">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                {subtitle && (
                    <p className="text-base-content/70">{subtitle}</p>
                )}
                <div className="justify-end card-actions mt-4">
                    <button 
                        className="btn btn-sm md:btn-md btn-primary" 
                        onClick={onClick}
                    >
                        Ver ideas guardadas
                    </button>
                </div>
            </div>
        </div>
    )
}
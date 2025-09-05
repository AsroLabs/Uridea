export default function Card({ title = "Sesión", description = "Sesión para decidir qué hacemos con este proyecto" }: { title: string; description: string }) {
    return (
        <div className="card-xs sm:card-sm md:card-md bg-base-100 shadow-sm">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="justify-end card-actions">
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    )
}
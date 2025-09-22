export default function Card({ title = "Sesión"}: { title: string}) {
    return (
        <div className="card-xs sm:card-sm md:card-md bg-base-100 shadow-sm rounded-2xl">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <div className="justify-end card-actions ">
                    <button className="btn btn-primary rounded btn-xs sm:btn-sm md:btn-md">View session</button>
                </div>
            </div>
        </div>
    )
}
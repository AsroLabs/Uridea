export default function JoinSection() {
    return (
        <section className="flex justify-center">
            <fieldset className="fieldset p-4">
                <div className="join">
                    <input type="text" className="input join-item" placeholder="Enter code to join a session" />
                    <button className="btn btn-secondary join-item">save</button>
                </div>
            </fieldset>
        </section>

    )
}

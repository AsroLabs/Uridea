import MenuHeader from "./components/MenuHeader";

export default function Menu() {
  return (
    <main>
      <MenuHeader />

      <section className="flex flex-row justify-around  px-2">
        <div className="*:leading-6">
          <h1 className="text-xl font-extrabold text-black">My Brainstorming Sessions</h1>
          <p className=" text-sm text-gray-500">Create or join Brainstorming Sessions</p>
        </div>

        <div>
          <button className="btn btn-primary">
            New session
          </button>
        </div>
      </section>
    </main>
  )
}
export default function MenuHeader() {
  return (
    <header className="navbar px-3 sm:px-4 md:px-6 w-full max-w-[100vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">

      <div className="flex-1">
        <a className="text-base sm:text-lg md:text-xl lg:text-2xl text-black">daisyUI</a>
      </div>
      
      <div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar hover:cursor-pointer hover:drop-shadow-md ">
            <div className="w-9 sm:w-11 md:w-12 rounded-full">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-48 sm:w-56 p-2 shadow-lg text-sm sm:text-base">
            <li>
              <a className="justify-between py-3">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a className="py-3">Settings</a></li>
            <li><a className="py-3">Logout</a></li>
          </ul>
        </div>
      </div>
    
    </header>
  )
}

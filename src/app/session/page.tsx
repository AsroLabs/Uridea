"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import UserCard from "./components/ui/UserCard";


interface Participant {
  id: string;
  name: string;
  avatar?: string;
  currentIdea?: {
    id: string;
    title: string;
  };
}

// Mock data for testing UI
const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    currentIdea: {
      id: "idea1",
      title: "Improve UX flow"
    }
  },
  {
    id: "2",
    name: "Alice Smith",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Bob Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    currentIdea: {
      id: "idea2",
      title: "Add dark mode"
    }
  },
  {
    id: "4",
    name: "Emma Wilson",
  }
];

export default function Session() {
  const currentUserId = "2"; // Mock current user ID for testing
  const router = useRouter();
  const { fullName, isLoading } = useUser();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error.message);
      } else {
        // Redirect to login page after successful logout
        router.push("/auth");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };
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
              <li>
                <div className="py-3 justify-between">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      {fullName || "Usuario"}
                      <span className="badge badge-primary">Online</span>
                    </>
                  )}
                </div>
              </li>
              <li><a className="py-3">Settings</a></li>
              <li><button className="py-3" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 sm:gap-8 place-items-center  mx-20 my-10">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </main>
    </>
  )
}

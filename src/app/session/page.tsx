"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

type ParticipantStatus = "active" | "inactive" | "adding" | "owner";

interface Participant {
  id: string;
  name: string;
  status: ParticipantStatus;
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
    status: "owner",
    avatar: "https://i.pravatar.cc/150?img=1",
    currentIdea: {
      id: "idea1",
      title: "Improve UX flow"
    }
  },
  {
    id: "2",
    name: "Alice Smith",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Bob Johnson",
    status: "adding",
    avatar: "https://i.pravatar.cc/150?img=3",
    currentIdea: {
      id: "idea2",
      title: "Add dark mode"
    }
  },
  {
    id: "4",
    name: "Emma Wilson",
    status: "inactive"
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

    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockParticipants.map((participant) => (
          <div
            key={participant.id}
            className={`card bg-base-100 shadow-xl ${
              participant.id === currentUserId
                ? "ring-2 ring-primary"
                : ""
            }`}
          >
            <div className="card-body p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt={participant.name} />
                    ) : (
                      <span className="text-xl">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{participant.name}</h3>
                    
                    {/* Status badges */}
                    {participant.status === "owner" && (
                      <div className="badge badge-secondary gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        Owner
                      </div>
                    )}
                    {participant.status === "active" && (
                      <div className="badge badge-success gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Active
                      </div>
                    )}
                    {participant.status === "inactive" && (
                      <div className="badge badge-ghost">Inactive</div>
                    )}
                    {participant.status === "adding" && (
                      <div className="badge badge-warning gap-2">
                        <span className="loading loading-spinner loading-xs"></span>
                        Adding idea
                      </div>
                    )}
                  </div>

                  {/* Current idea preview */}
                  {participant.currentIdea && (
                    <div className="mt-2">
                      <div className="tooltip" data-tip={participant.currentIdea.title}>
                        <div className="text-sm text-base-content/70 truncate max-w-[200px]">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                          </svg>
                          {participant.currentIdea.title}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  )
}

import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinSection() {
    const { user, fullName, isLoading } = useUser();
    const [code, setCode] = useState("");
    const router = useRouter();

    async function joinSessionByCode(code: string) {
        const supabase = createClient();

        if (!user) {
            throw new Error('User must be authenticated to create a session');
        }

        const { data: session } = await supabase
            .from('sessions')
            .select('*')
            .eq('code', code)
            .eq('status', 'active')
            .single()

        if (!session) throw new Error('Sesión no encontrada o cerrada')

        const { data: participants } = await supabase
            .from('session_participants')
            .select('*')
            .eq('session_id', session.id)
            .eq('status', 'active')
            .single()

        if (!participants) throw new Error('Sesión no encontrada o cerrada')
        // Insertar o reactivar participante
        // const { error, data: participants } = await supabase
        //     .from('session_participants')
        //     .upsert({
        //         session_id: session.id,
        //         user_id: user.id,
        //         status: 'active'
        //     }, { onConflict: 'session_id,user_id' })

        // if (error) throw error

        return console.info({session, participants} );

    }

    return (
        <section className="flex justify-center">
            <fieldset className="fieldset p-4">
                <div className="join">
                    <input type="text" className="input join-item" placeholder="Enter code to join a session" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button className="btn btn-secondary join-item" onClick={() => joinSessionByCode(code)}>join</button>
                </div>
            </fieldset>
        </section>

    )
}

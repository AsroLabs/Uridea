import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client"

export default function JoinSection() {

    async function joinSessionByCode(code: string) {

        const supabase = createClient();
        const { user } = useUser();

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

        // Insertar o reactivar participante
        const { error } = await supabase
            .from('session_participants')
            .upsert({
                session_id: session.id,
                user_id: user.id,
                status: 'active'
            }, { onConflict: 'session_id,user_id' })

        if (error) throw error

        return session.id
    }

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

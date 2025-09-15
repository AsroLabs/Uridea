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
            throw new Error('Debes estar autenticado para unirte a una sesión');
        }

        try {
            // 1. Verificar si la sesión existe y está activa
            const { data: session, error: sessionError } = await supabase
                .from('sessions')
                .select('*')
                .eq('code', code.toUpperCase())
                .eq('status', 'active')
                .single();

            if (sessionError || !session) {
                console.error('Session error:', sessionError);
                throw new Error('Sesión no encontrada o cerrada');
            }
            
            console.log('Session found:', session);

            // 2. Verificar si ya somos participantes
            const { data: existingParticipant } = await supabase
                .from('session_participants')
                .select('*')
                .eq('session_id', session.id)
                .eq('user_id', user.id)
                .single();

            if (existingParticipant?.status === 'active') {
                // Ya estamos en la sesión, simplemente redirigimos
                router.push(`/session/${session.id}`);
                return;
            }

            // 3. Insertar participante
            const { data: participant, error: participantError } = await supabase
                .from('session_participants')
                .insert({
                    session_id: session.id,
                    user_id: user.id,
                    status: 'active'
                })
                .select()
                .single();

            if (participantError) {
                console.error('Participant error:', participantError);
                throw new Error(`Error al unirse a la sesión: ${participantError.message}`);
            }

            if (!participant) {
                throw new Error('No se pudo crear el participante');
            }

            console.log('Successfully joined session');

            // 4. Redirigir a la página de la sesión
            router.push(`/session/${session.id}`);
        } catch (error) {
            console.error('Join session error:', error);
            throw error;
        }

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

"use client";

import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function HeroSection() {
    const { user, fullName, isLoading } = useUser();
    const [title, setTitle] = useState("");
    
    async function createSession(title: string) {
        if (!user) {
            throw new Error('User must be authenticated to create a session');
        }

        const supabase = createClient();
        const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // código corto

        const { data: session, error } = await supabase
            .from('sessions')
            .insert([{ code, title, owner_id: user.id }])
            .select()
            .single()

        if (error) throw error

        await supabase.from('session_participants').insert([{
            session_id: session.id,
            user_id: user.id,
            status: 'active'
        }])

        return console.info(session) // contiene id y code
    }


    return (
        <section className="flex flex-col md:flex-row md:justify-around items-center gap-5 px-2 py-8">
            <div className="text-center">
                <h1 className="text-lg md:text-xl font-extrabold text-black leading-6 md:leading-10">
                    {isLoading ? (
                        <span className="loading loading-dots loading-md"></span>
                    ) : (
                        `¡Hola, ${fullName || "Usuario"}!`
                    )}
                </h1>
                <p className="text-sm text-gray-500 leading-4">Create or join Brainstorming Sessions</p>
            </div>

            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn rounded btn-primary  btn-sm md:btn-md lg:btn-lg" onClick={() => {
                const modal = document.getElementById('newSession') as HTMLDialogElement;
                modal?.showModal();
            }}>+ New session</button>
            <dialog id="newSession" className="modal">
                <fieldset className="fieldset modal-box py-10">
                    <div className="join">
                        <input type="text" className="input join-item" placeholder="New session name" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <button className="btn btn-secondary join-item" onClick={() => {createSession(title)}}>Create</button>
                    </div>
                </fieldset>

            </dialog>

        </section>
    )
}

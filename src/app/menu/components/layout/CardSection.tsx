'use client'

import { useRouter } from 'next/navigation'
import Card from "../ui/Card"
import { useSavedSessions } from "@/hooks/useSavedSessions"
import { useEffect } from 'react'

export default function CardSection() {
    const { sessions, isLoading, reloadSessions } = useSavedSessions()
    const router = useRouter()

    useEffect(() => { reloadSessions() }, [reloadSessions]);

    if (isLoading) {
        return (
            <section className="grid grid-cols-2 gap-4 place-items-center max-w-4xl mx-auto mb-8 px-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="skeleton w-full h-48"></div>
                ))}
            </section>
        )
    }

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center max-w-4xl mx-auto mb-8 px-4">
            {sessions.length > 0 ? (
                sessions.map(session => (
                    <Card
                        key={session.id}
                        title={session.title}
                        subtitle="Ver ideas guardadas"
                        onClick={() => router.push(`/saved-sessions/${session.id}`)}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-10">
                    <p className="text-lg text-base-content/70">No hay sesiones con ideas guardadas</p>
                </div>
            )}
        </section>
    )
}
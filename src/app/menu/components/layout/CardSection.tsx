import { useEffect, useState } from "react";
import Card from "../ui/Card";
import useSavedSessions from "@/hooks/useSavedSessions";
import type { SavedSession } from "@/hooks/useSavedSessions";

export default function CardSection() {
    const [sessions, setSessions] = useState<SavedSession[]>([]);
    useEffect(() => {
        const getSessions = async () => {
            const { savedSessions } = await useSavedSessions();
            setSessions(savedSessions);
        }

        getSessions();
    }, []);
    return (
        <section className="grid grid-cols-2 gap-4 place-items-center max-w-4xl mx-auto mb-8 px-2 text-balance">
            {sessions.map(session => (
                <Card key={session.id} title={session.title} />
            ))}
        </section>
    )
}
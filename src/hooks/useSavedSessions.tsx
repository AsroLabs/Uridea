'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useUser } from './useUser'

export interface SavedSession {
    id: string
    title: string
    is_ended: boolean
    created_at: string
    owner_id: string
}

export function useSavedSessions() {
    const [sessions, setSessions] = useState<SavedSession[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useUser()
    const supabase = createClient()

    const loadSavedSessions = useCallback(async () => {
        try {
            console.log('Loading saved sessions...');
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('is_ended', true)


            console.log('Query result:', { data, error });

            if (error) {
                console.error('Error loading saved sessions:', error);
                return;
            }

            // Filter out duplicates and format the response
            const uniqueSessions: SavedSession[] = [...new Set(data.map(session => session.id))]
                .map(id => {
                    const session = data.find(s => s.id === id)!;
                    return {
                        id: session.id,
                        title: session.title,
                        is_ended: session.is_ended,
                        created_at: session.created_at,
                        owner_id: session.owner_id
                    };
                });

            console.log('Unique sessions:', uniqueSessions);
            setSessions(uniqueSessions)
        } catch (error) {
            console.error('Error in loadSavedSessions:', error)
        } finally {
            setIsLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        loadSavedSessions()

        // Subscribe to changes in sessions and ideas
        const channel = supabase
            .channel('saved_sessions_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'sessions',
                    filter: 'status=eq.ended'
                },
                () => {
                    loadSavedSessions()
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'ideas',
                    filter: 'status=eq.saved'
                },
                () => {
                    loadSavedSessions()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, loadSavedSessions])

    return {
        sessions,
        isLoading,
        reloadSessions: loadSavedSessions
    }
}
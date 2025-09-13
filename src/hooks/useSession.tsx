'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UseRealtimeSessionProps {
  sessionId: string
  userId: string
}

interface Session {
  id: string
  title: string
  status: 'active' | 'ended'
  owner_id: string
  created_at: string
}

interface Participant {
  id: string
  session_id: string
  user_id: string
  status: 'active' | 'inactive'
  joined_at: string
}

export default function useRealtimeSession({ sessionId, userId }: UseRealtimeSessionProps) {
  const supabase = createClient()

  // const [session, setSession] = useState<Session | null>(null)
  // const [participants, setParticipants] = useState<Participant[]>([])
  // const [isConnected, setIsConnected] = useState(false)

  /*
  // 1. Cargar estado inicial de la sesión
  const fetchInitialData = useCallback(async () => {
    const { data: sessionData } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    const { data: participantsData } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)

    if (sessionData) setSession(sessionData)
    if (participantsData) setParticipants(participantsData)
  }, [sessionId, supabase])

  // 2. Suscribirse a cambios en tiempo real
  useEffect(() => {
    fetchInitialData()

    const channel = supabase.channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          if (payload.new) setSession(payload.new as Session)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'session_participants', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setParticipants((prev) => [...prev, payload.new as Participant])
          }
          if (payload.eventType === 'UPDATE') {
            setParticipants((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Participant) : p))
            )
          }
          if (payload.eventType === 'DELETE') {
            setParticipants((prev) => prev.filter((p) => p.id !== payload.old.id))
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsConnected(true)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, fetchInitialData, supabase])

  // 3. Acciones de usuario (ej: salir, cambiar estado)
  const updateParticipantStatus = useCallback(
    async (status: 'active' | 'inactive') => {
      await supabase
        .from('session_participants')
        .update({ status })
        .eq('session_id', sessionId)
        .eq('user_id', userId)
    },
    [supabase, sessionId, userId]
  )

  return {
    session,
    participants,
    isConnected,
    updateParticipantStatus,
  }
  
  */
}


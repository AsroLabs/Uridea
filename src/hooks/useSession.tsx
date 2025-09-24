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
  is_ended: boolean
  owner_id: string
  created_at: string
}

interface Participant {
  id: string
  session_id: string
  user_id: string
  full_name: string
  is_owner: boolean
  ideaPermission: boolean
}

export default function useRealtimeSession({ sessionId, userId }: UseRealtimeSessionProps) {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true)
      // 1. Verificar si la sesión existe y está activa
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError || !sessionData) {
        console.error('Error al cargar la sesión:', sessionError)
        return false
      }

      // 2. Obtener participantes activos con sus datos de usuario
      const { data: participantsData, error: participantsError } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId)

      if (participantsError) {
        console.error('Error al cargar participantes:', participantsError)
        return false
      }

      if (!participantsData || participantsData.length === 0) {
        console.error('No hay participantes activos')
        return false
      }

      const formattedParticipants = participantsData.map(p => ({
        id: p.id,
        session_id: p.session_id,
        user_id: p.user_id,

        full_name: p.username,
        is_owner: p.is_owner,
        ideaPermission: p.ideaPermission
      }))

      setSession(sessionData)
      setParticipants(formattedParticipants)
      return true
    } catch (error) {
      console.error('Error loading session data:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, supabase])

  useEffect(() => {
    if (!sessionId) return

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

  const removeParticipant = useCallback(
    async () => {
      if (!userId) return
      
      try {
        const { error } = await supabase
          .from('session_participants')
          .delete()
          .eq('session_id', sessionId)
          .eq('user_id', userId)

        if (error) throw error
      } catch (error) {
        console.error('Error removing participant:', error)
      }
    },
    [supabase, sessionId, userId]
  )

  const endSession = useCallback(async () => {
    try {
      // 1. Set is_ended to true
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ is_ended: true })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // 2. Delete all participants
      const { error: participantsError } = await supabase
        .from('session_participants')
        .delete()
        .eq('session_id', sessionId);

      if (participantsError) throw participantsError;

      // Force update local state
      setSession(prev => prev ? { ...prev, is_ended: true } : null);
      setParticipants([]);

    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }, [sessionId, supabase]);

  return {
    session,
    participants,
    isLoading,
    isConnected,
    removeParticipant,
    reloadSession: fetchInitialData,
    endSession
  }
}


'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Idea {
  id: string
  title: string
  description: string
  session_id: string
  user_id: string
  created_at: string
  status: 'saved' | 'draft' | 'discarded'
  likes: number
  dislikes: number
  userRating?: 'like' | 'dislike' | null
}

interface UseIdeasProps {
  sessionId: string
  userId?: string
}

export function useIdeas({ sessionId, userId }: UseIdeasProps) {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadIdeas = useCallback(async () => {
    try {
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .eq('session_id', sessionId)
        .eq('status', 'draft')

      if (ideasError) {
        console.error('Error al cargar ideas:', ideasError)
        return
      }

      const ideasWithUserRating = ideasData?.map(idea => ({
        ...idea,
        userRating: null
      })) || []

      setIdeas(ideasWithUserRating)
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, supabase])

  const handleRateIdea = useCallback(async (ideaId: string, action: 'like' | 'dislike') => {
    if (!userId) return

    try {
      const ideaToUpdate = ideas.find(idea => idea.id === ideaId)
      if (!ideaToUpdate) return

      const isRemovingRating = ideaToUpdate.userRating === action

      const newLikes = ideaToUpdate.likes + (
        action === 'like'
          ? (isRemovingRating ? -1 : 1)
          : (ideaToUpdate.userRating === 'like' ? -1 : 0)
      )
      
      const newDislikes = ideaToUpdate.dislikes + (
        action === 'dislike'
          ? (isRemovingRating ? -1 : 1)
          : (ideaToUpdate.userRating === 'dislike' ? -1 : 0)
      )

      // Optimistic update
      setIdeas(currentIdeas =>
        currentIdeas.map(idea =>
          idea.id === ideaId
            ? {
                ...idea,
                userRating: isRemovingRating ? null : action,
                likes: newLikes,
                dislikes: newDislikes
              }
            : idea
        )
      )

      const { error } = await supabase
        .from('ideas')
        .update({
          likes: newLikes,
          dislikes: newDislikes
        })
        .eq('id', ideaId)

      if (error) throw error
    } catch (error) {
      console.error('Error al actualizar el rating:', error)
      loadIdeas()
    }
  }, [ideas, userId, supabase, loadIdeas])

  const handleManageIdea = useCallback(async (ideaId: string, action: 'save' | 'discard') => {
    try {
      const ideaToUpdate = ideas.find(idea => idea.id === ideaId)
      if (!ideaToUpdate) return

      // Optimistic update - remove idea from list since we're either saving or discarding
      setIdeas(currentIdeas => currentIdeas.filter(idea => idea.id !== ideaId))

      if (action === 'save') {
        const { error } = await supabase
          .from('ideas')
          .update({ status: 'saved' })
          .eq('id', ideaId)

        if (error) throw error
      }
      
      if (action === 'discard') {
        // For discard, we delete the idea
        const { error } = await supabase
          .from('ideas')
          .delete()
          .eq('id', ideaId)


        if (error) throw error
      }
    } catch (error) {
      console.error('Error managing idea:', error)
      // On error, reload ideas to restore state
      loadIdeas()
    }
  }, [ideas, supabase, loadIdeas])

  useEffect(() => {
    if (!sessionId) return

    loadIdeas()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`ideas_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload: any) => {
          if (payload.eventType === 'DELETE') {
            setIdeas(currentIdeas => currentIdeas.filter(idea => idea.id !== payload.old.id))
          }
          else if (payload.eventType === 'UPDATE') {
            if (payload.new.status !== 'draft') {
              // Remove ideas that are no longer in draft status
              setIdeas(currentIdeas => currentIdeas.filter(idea => idea.id !== payload.new.id))
            } 
            else if (payload.new.likes !== undefined || payload.new.dislikes !== undefined) {
              // Update likes/dislikes count
              setIdeas(currentIdeas => 
                currentIdeas.map(idea => 
                  idea.id === payload.new.id
                    ? { ...idea, likes: payload.new.likes, dislikes: payload.new.dislikes }
                    : idea
                )
              )
            } else {
              loadIdeas()
            }
          } else {
            loadIdeas()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, supabase, loadIdeas])

  return {
    ideas,
    isLoading,
    handleRateIdea,
    handleManageIdea
  }
}
'use client'

import { FormEvent, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UseCreateIdeaProps {
  sessionId: string
  userId?: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

interface IdeaFormData {
  title: string
  description: string
}

export function useCreateIdea({ sessionId, userId, onSuccess, onError }: UseCreateIdeaProps) {
  const handleCreateIdea = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!userId) return
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title || !description) return

    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('ideas')
        .insert({
          title: title.trim(),
          description: description.trim(),
          session_id: sessionId,
          user_id: userId,
          status: 'draft',
          likes: 0,
          dislikes: 0
        })

      if (error) throw error

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error al crear idea:', error)
      onError?.(error)
    }
  }, [sessionId, userId, onSuccess, onError])

  return {
    handleCreateIdea
  }
}
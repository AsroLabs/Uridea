'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface SavedIdea {
  id: string
  title: string
  description: string
  user_id: string
  created_at: string
  user: {
    full_name: string
  }
  likes: number
  dislikes: number
}

export default function SavedIdeasPage() {
  const { sessionId } = useParams()
  const [ideas, setIdeas] = useState<SavedIdea[]>([])
  const [sessionTitle, setSessionTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadSavedIdeas = useCallback(async () => {
    try {
      // Get session title
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('title')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError
      setSessionTitle(sessionData.title)

      // Get saved ideas with user information
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .eq('session_id', sessionId)
        .eq('status', 'saved')
        .order('created_at', { ascending: true })

      if (ideasError) throw ideasError
      setIdeas(ideasData || [])
    } catch (error) {
      console.error('Error loading saved ideas:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, supabase])

  useEffect(() => {
    loadSavedIdeas()
  }, [loadSavedIdeas])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{sessionTitle} - Ideas Guardadas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{idea.title}</h2>
              <p className="text-base-content/70">{idea.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4">
                  <div className="badge badge-primary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {idea.likes}
                  </div>
                  <div className="badge badge-error gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 0h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5" />
                    </svg>
                    {idea.dislikes}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">{idea.user?.full_name}</span>
                  <span className="text-xs text-base-content/60">
                    {new Date(idea.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
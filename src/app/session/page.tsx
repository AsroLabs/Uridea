'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import useRealtimeSession from '@/hooks/useSession'
import { useUser } from '@/hooks/useUser'
import UserCard from './components/ui/UserCard'
import { useIdeas, type Idea } from '@/hooks/useIdeas'

export default function SessionPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('id') || ''
  const { user } = useUser()
  
  // Get session and participants data
  const { session, participants, isLoading: isSessionLoading } = useRealtimeSession({
    sessionId,
    userId: user?.id || ''
  })

  // Get ideas data and management functions
  const { ideas, handleManageIdea, isLoading: isIdeasLoading } = useIdeas({
    sessionId,
    userId: user?.id
  })

  // Find current user in participants to determine if they're the owner
  const currentParticipant = participants.find(p => p.user_id === user?.id)
  const isOwner = currentParticipant?.isOwner || false

  if (isSessionLoading || isIdeasLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Session not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{session.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant) => (
          <UserCard
            key={participant.id}
            fullName={participant.full_name}
            user_id={participant.user_id}
            userIdeas={ideas.filter((idea: Idea) => idea.user_id === participant.user_id)}
            hasIdeas={ideas.some((idea: Idea) => idea.user_id === participant.user_id)}
            currentUserId={user?.id}
            isOwner={isOwner}
            onManageIdea={handleManageIdea}
          />
        ))}
      </div>
    </div>
  )
}

import { Idea } from '@/hooks/useIdeas'

export const calculateNewRatingCounts = (
  idea: Idea,
  action: 'like' | 'dislike',
  isRemovingRating: boolean
) => {
  const newLikes = idea.likes + (
    action === 'like'
      ? (isRemovingRating ? -1 : 1)
      : (idea.userRating === 'like' ? -1 : 0)
  )
  
  const newDislikes = idea.dislikes + (
    action === 'dislike'
      ? (isRemovingRating ? -1 : 1)
      : (idea.userRating === 'dislike' ? -1 : 0)
  )

  return {
    likes: newLikes,
    dislikes: newDislikes
  }
}

export const getUserIdeasForParticipant = (ideas: Idea[], participantUserId: string) => {
  return ideas.filter(idea => idea.user_id === participantUserId)
}

export const hasUserRatedIdea = (idea: Idea) => {
  return idea.userRating !== null
}

export const canUserRateIdea = (idea: Idea, userId?: string) => {
  return !!userId && idea.user_id !== userId // Can't rate own ideas
}

export const formatIdeaDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}
import { createClient } from "@/utils/supabase/client"

export interface SavedSession {
    id: string
    title: string
    user_id: string
    created_at: string
}

export default async function useSavedSessions(): Promise<{
    savedSessions: SavedSession[]
}> {
    const supabase = createClient()

    const getSessions = async () => {
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('status', 'saved')

        if (error) {
            console.error('Error fetching saved sessions:', error)
            return []
        }

        return data as SavedSession[]
    }
    return {
        savedSessions: await getSessions()
    }
}
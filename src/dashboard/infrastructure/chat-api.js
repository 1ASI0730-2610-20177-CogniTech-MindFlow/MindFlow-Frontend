import apiClient from '@/shared/infrastructure/base-api'

const CHAT_URL = '/chat/conversations'

export class ChatApiService {
    async getConversations() {
        try {
            const response = await apiClient.get(CHAT_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching conversations:', error)
            return []
        }
    }

    async createConversation(content, category) {
        const response = await apiClient.post(CHAT_URL, { content, category })
        return response.data
    }

    async getMessages(conversationId) {
        try {
            const response = await apiClient.get(`${CHAT_URL}/${conversationId}/messages`)
            return response.data
        } catch (error) {
            console.error('Error fetching messages:', error)
            return []
        }
    }

    async sendMessage(conversationId, content) {
        const response = await apiClient.post(`${CHAT_URL}/${conversationId}/messages`, { content })
        return response.data
    }

    async deleteConversation(conversationId) {
        try {
            await apiClient.delete(`${CHAT_URL}/${conversationId}`)
        } catch (error) {
            console.error('Error deleting conversation:', error)
            throw error
        }
    }
}

export const ChatAPI = new ChatApiService()

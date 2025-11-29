const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const apiService = {
    async sendMessage(message, threadId) {
        const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ content: message })
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },

    async createThread() {
        const response = await fetch(`${API_URL}/threads`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to create thread');
        const data = await response.json();
        return data.id;
    },

    async getThreads() {
        const response = await fetch(`${API_URL}/threads`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch threads');
        return response.json();
    },

    async getMessages(threadId) {
        const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    },

    async updateThread(id, data) {
        const response = await fetch(`${API_URL}/threads/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update thread');
        return response.json();
    },

    async deleteThread(id) {
        const response = await fetch(`${API_URL}/threads/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete thread');
        return response.text();
    },

    async uploadDocument(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to upload document');
        }
        return response.json();
    },

    async getDocuments() {
        const response = await fetch(`${API_URL}/documents`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch documents');
        return response.json();
    },

    async deleteDocument(id) {
        const response = await fetch(`${API_URL}/documents/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete document');
        return response.text();
    }
};

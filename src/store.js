import { reactive } from 'vue'

export const store = reactive({
    links: [],
    toastMessage: '',
    addLink(link) {
        this.links.push(link)
        this.saveToLocalStorage()
    },
    deleteLink(link) {
        const index = this.links.findIndex(l => l.id === link.id)
        if (index > -1) {
            this.links.splice(index, 1)
            this.saveToLocalStorage()
        }
    },
    vote(link, value) {
        const foundLink = this.links.find(l => l.id === link.id)
        if (foundLink) {
            foundLink.votes += value
            foundLink.lastVoted = Date.now()
            this.saveToLocalStorage()
        }
    },
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('links')
            if (saved) {
                this.links = JSON.parse(saved)
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error)
            this.links = []
        }
    },
    saveToLocalStorage() {
        try {
            localStorage.setItem('links', JSON.stringify(this.links))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    },
    setToastMessage(message) {
        this.toastMessage = message
    },
    clearToastMessage() {
        this.toastMessage = ''
    }
}) 
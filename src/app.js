import { createApp } from 'vue'

const App = {
    template: `
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container">
                    <a class="navbar-brand" href="#list" @click.prevent="navigateTo('list')">Link Voting App</a>
                    <div class="navbar-nav">
                        <a class="nav-link" href="#list" @click.prevent="navigateTo('list')">List</a>
                        <a class="nav-link" href="#add" @click.prevent="navigateTo('add')">Add Link</a>
                    </div>
                </div>
            </nav>

            <div class="container mt-4">
                <!-- List Page -->
                <div v-if="currentPage === 'list'">
                    <div class="mb-3">
                        <select v-model="sortType" class="form-select">
                            <option value="newest">Newest First</option>
                            <option value="mostVoted">Most Voted</option>
                            <option value="leastVoted">Least Voted</option>
                        </select>
                    </div>

                    <div class="link-item position-relative p-3 border rounded mb-2" 
                         v-for="link in paginatedLinks" :key="link.id">
                        <button @click="deleteLink(link)" class="btn btn-danger btn-sm delete-btn">
                            <i class="bi bi-trash"></i>
                        </button>
                        <div class="d-flex align-items-center">
                            <div class="points-badge">
                                <span class="points-number">{{ link.votes }}</span>
                                <span class="points-text">Points</span>
                            </div>
                            <div>
                                <h5>{{ link.title }}</h5>
                                <p class="text-muted">({{ link.url }})</p>
                                <div class="d-flex align-items-center">
                                    <button @click="vote(link, 1)" class="btn btn-sm me-2 upvote">
                                        <i class="bi bi-arrow-up"></i> Up Vote
                                    </button>
                                    <button @click="vote(link, -1)" class="btn btn-sm downvote">
                                        <i class="bi bi-arrow-down"></i> Down Vote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <nav v-if="totalPages > 1">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: currentListPage === 1 }">
                                <a class="page-link" href="#" @click.prevent="currentListPage = Math.max(1, currentListPage - 1)">
                                    <i class="bi bi-chevron-left"></i>
                                </a>
                            </li>
                                    <li v-for="page in totalPages" :key="page" 
                                        :class="['page-item', { active: page === currentListPage }]">
                                        <a class="page-link" href="#" @click.prevent="currentListPage = page">{{ page }}</a>
                                    </li>
                            <li class="page-item" :class="{ disabled: currentListPage === totalPages }">
                                <a class="page-link" href="#" @click.prevent="currentListPage = Math.min(totalPages, currentListPage + 1)">
                                    <i class="bi bi-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Add Link Page -->
                <div v-if="currentPage === 'add'" class="col-md-6">
                    <a href="#list" @click.prevent="navigateTo('list')" class="text-decoration-none text-dark mb-4 d-inline-block">
                        ← Return to List
                    </a>
                    <h2>Add New Link</h2>
                    <form @submit.prevent="addLink">
                        <div class="mb-3">
                            <label class="form-label">Link Name:</label>
                            <input v-model="newLink.title" type="text" class="form-control" 
                                   placeholder="e.g. Alphabet" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Link URL:</label>
                            <input v-model="newLink.url" type="url" class="form-control" 
                                   placeholder="e.g. http://abc.xyz" required>
                        </div>
                        <button type="submit" class="btn btn-dark">ADD</button>
                    </form>
                </div>
            </div>

            <!-- Toast Notifications -->
            <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" v-if="showToast">
                    <div class="toast-body">
                        {{ toastMessage }}
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="deleteModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Remove Link</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <p>Do you want to remove:</p>
                            <h4>{{ linkToDelete?.title }}</h4>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-dark" @click="confirmDelete">OK</button>
                            <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">CANCEL</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            currentPage: 'list',
            links: [],
            newLink: {
                title: '',
                url: ''
            },
            sortType: 'newest',
            currentListPage: 1,
            showToast: false,
            toastMessage: '',
            deleteModal: null,
            linkToDelete: null
        }
    },
    computed: {
        sortedLinks() {
            let sorted = [...this.links]
            if (this.sortType === 'mostVoted') {
                sorted.sort((a, b) => b.votes - a.votes || b.lastVoted - a.lastVoted)
            } else if (this.sortType === 'leastVoted') {
                sorted.sort((a, b) => a.votes - b.votes || b.lastVoted - a.lastVoted)
            } else {
                sorted.sort((a, b) => b.timestamp - a.timestamp)
            }
            return sorted
        },
        paginatedLinks() {
            const start = (this.currentListPage - 1) * 5
            return this.sortedLinks.slice(start, start + 5)
        },
        totalPages() {
            return Math.ceil(this.links.length / 5)
        }
    },
    methods: {
        loadLinks() {
            const stored = localStorage.getItem('links')
            this.links = stored ? JSON.parse(stored) : []
        },
        handleNavigation() {
            const hash = window.location.hash.slice(1) || 'list'
            this.currentPage = hash
        },
        navigateTo(page) {
            window.location.hash = page
            this.currentPage = page
        },
        saveLinks() {
            localStorage.setItem('links', JSON.stringify(this.links))
        },
        addLink() {
            const link = {
                id: Date.now(),
                ...this.newLink,
                votes: 0,
                timestamp: Date.now(),
                lastVoted: Date.now()
            }
            this.links.unshift(link)
            this.saveLinks()
            this.newLink = { title: '', url: '' }
            this.navigateTo('list')
            this.showToastMessage(`${link.title} added.`)
        },
        vote(link, value) {
            link.votes += value
            link.lastVoted = Date.now()
            this.saveLinks()
        },
        deleteLink(link) {
            this.linkToDelete = link
            if (this.deleteModal) {
                this.deleteModal.show()
            }
        },
        confirmDelete() {
            if (this.linkToDelete) {
                const deletedTitle = this.linkToDelete.title
                this.links = this.links.filter(l => l.id !== this.linkToDelete.id)
                this.saveLinks()
                if (this.deleteModal) {
                    this.deleteModal.hide()
                }
                this.showToastMessage(`${deletedTitle} removed.`)
                this.linkToDelete = null
            }
        },
        showToastMessage(message) {
            this.toastMessage = message
            this.showToast = true
            setTimeout(() => {
                this.showToast = false
            }, 3000)
        },
        initializeModal() {
            setTimeout(() => {
                const modalElement = document.getElementById('deleteModal')
                if (modalElement && window.bootstrap) {
                    this.deleteModal = new bootstrap.Modal(modalElement)
                }
            }, 100)
        }
    },
    mounted() {
        this.handleNavigation()
        window.addEventListener('hashchange', this.handleNavigation)
        this.loadLinks()
        this.initializeModal()
    },
    unmounted() {
        window.removeEventListener('hashchange', this.handleNavigation)
        if (this.deleteModal) {
            this.deleteModal.dispose()
        }
    }
}

export default App

if (typeof window !== 'undefined') {
    const app = createApp(App)
    app.mount('#app')
}
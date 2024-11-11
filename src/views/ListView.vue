<template>
    <div>
        <div class="mb-3">
            <select v-model="sortType" class="form-select">
                <option value="newest">Newest First</option>
                <option value="mostVoted">Most Voted</option>
                <option value="leastVoted">Least Voted</option>
            </select>
        </div>
        <div class="list-group">
            <div v-for="link in paginatedLinks" :key="link.id" class="list-group-item link-item position-relative">
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

                <button class="btn btn-sm btn-danger delete-btn" @click="showDeleteModal(link)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>

        <Pagination :current-page="currentListPage" :total-pages="totalPages" @page-change="currentListPage = $event" />

        <DeleteModal :link="linkToDelete" @confirm="confirmDelete" ref="deleteModal" />
    </div>
</template>

<script>
import { store } from '../store'
import { toastStore } from '../toastStore'
import DeleteModal from '../components/DeleteModal.vue'
import Pagination from '../components/Pagination.vue'

export default {
    name: 'ListView',
    components: {
        DeleteModal,
        Pagination
    },
    data() {
        return {
            sortType: 'newest',
            currentListPage: 1,
            itemsPerPage: 5,
            linkToDelete: null
        }
    },
    computed: {
        links() {
            return store.links
        },
        sortedLinks() {
            const links = [...this.links]
            switch (this.sortType) {
                case 'mostVoted':
                    return links.sort((a, b) => b.votes - a.votes || b.lastVoted - a.lastVoted)
                case 'leastVoted':
                    return links.sort((a, b) => a.votes - b.votes || b.lastVoted - a.lastVoted)
                case 'newest':
                default:
                    return links.sort((a, b) => b.timestamp - a.timestamp)
            }
        },
        paginatedLinks() {
            const start = (this.currentListPage - 1) * this.itemsPerPage
            const end = start + this.itemsPerPage
            return this.sortedLinks.slice(start, end)
        },
        totalPages() {
            return Math.ceil(this.links.length / this.itemsPerPage)
        }
    },
    methods: {
        vote(link, value) {
            store.vote(link, value)
        },
        showDeleteModal(link) {
            this.linkToDelete = link
            this.$refs.deleteModal.show()
        },
        confirmDelete() {
            store.deleteLink(this.linkToDelete)
            this.$refs.deleteModal.hide()
            toastStore.showToast('Link deleted successfully!')
        }
    },
    mounted() {
        store.loadFromLocalStorage()
    }
}
</script>
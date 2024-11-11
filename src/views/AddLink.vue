<template>
    <div class="col-md-6">
        <router-link to="/list" class="text-decoration-none text-dark mb-4 d-inline-block">
            ← Return to List
        </router-link>
        <h2>Add New Link</h2>
        <form @submit.prevent="addLink">
            <div class="mb-3">
                <label class="form-label">Link Title</label>
                <input type="text" class="form-control" v-model="newLink.title" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Link URL</label>
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="newLink.url" 
                    required
                    pattern="^(https?:\/\/|www\.)[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}.*$"
                    title="Please enter a valid URL (starting with http://, https://, or www.)"
                >
                <small class="form-text text-muted">
                    URL should start with http://, https://, or www.
                </small>
            </div>
            <button type="submit" class="btn btn-dark">ADD</button>
        </form>
    </div>
</template>

<script>
import { store } from '../store'
import { toastStore } from '../toastStore'

export default {
    name: 'AddLink',
    data() {
        return {
            newLink: {
                title: '',
                url: ''
            }
        }
    },
    methods: {
        async addLink() {
            let formattedUrl = this.newLink.url
            if (formattedUrl.startsWith('www.')) {
                formattedUrl = 'https://' + formattedUrl
            } else if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl
            }

            const link = {
                id: Date.now(),
                title: this.newLink.title,
                url: formattedUrl,
                votes: 0,
                timestamp: Date.now(),
                lastVoted: Date.now()
            }
            
            store.addLink(link)
            toastStore.showToast('Link added successfully!')
            await new Promise(resolve => setTimeout(resolve, 100))
            await this.$router.push('/list')
        }
    }
}
</script>

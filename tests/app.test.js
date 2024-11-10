import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'

// Import your actual app configuration from app.js
import App from '../src/app.js'

describe('Link Voting App', () => {
    let wrapper

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
        // Mount the actual app component
        wrapper = mount(App)
    })

    // Test adding a link
    it('adds a new link correctly', async () => {
        const newLink = {
            title: 'Test Link',
            url: 'https://test.com'
        }

        wrapper.vm.newLink = newLink
        await wrapper.vm.addLink()

        expect(wrapper.vm.links).toHaveLength(1)
        expect(wrapper.vm.links[0].title).toBe(newLink.title)
        expect(wrapper.vm.links[0].url).toBe(newLink.url)
        expect(wrapper.vm.links[0].votes).toBe(0)
    })

    // Test voting
    it('updates votes correctly', async () => {
        const link = {
            id: 1,
            title: 'Test Link',
            url: 'https://test.com',
            votes: 0,
            timestamp: Date.now(),
            lastVoted: Date.now()
        }
        wrapper.vm.links = [link]

        await wrapper.vm.vote(link, 1)
        expect(link.votes).toBe(1)

        await wrapper.vm.vote(link, -1)
        expect(link.votes).toBe(0)
    })

    // Test sorting
    it('sorts links correctly', async () => {
        const links = [
            { id: 1, title: 'Link 1', votes: 5, timestamp: 1000, lastVoted: 1000 },
            { id: 2, title: 'Link 2', votes: 10, timestamp: 2000, lastVoted: 2000 },
            { id: 3, title: 'Link 3', votes: 2, timestamp: 3000, lastVoted: 3000 }
        ]
        wrapper.vm.links = links

        // Test most voted sorting
        wrapper.vm.sortType = 'mostVoted'
        const mostVotedLinks = wrapper.vm.sortedLinks
        expect(mostVotedLinks[0].votes).toBe(10)
        expect(mostVotedLinks[2].votes).toBe(2)

        // Test least voted sorting
        wrapper.vm.sortType = 'leastVoted'
        const leastVotedLinks = wrapper.vm.sortedLinks
        expect(leastVotedLinks[0].votes).toBe(2)
        expect(leastVotedLinks[2].votes).toBe(10)

        // Test newest sorting
        wrapper.vm.sortType = 'newest'
        const newestLinks = wrapper.vm.sortedLinks
        expect(newestLinks[0].timestamp).toBe(3000)
        expect(newestLinks[2].timestamp).toBe(1000)
    })

    // Test pagination
    it('paginates links correctly', async () => {
        const links = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            title: `Link ${i + 1}`,
            votes: 0,
            timestamp: Date.now() + i,
            lastVoted: Date.now() + i
        }))
        wrapper.vm.links = links

        expect(wrapper.vm.totalPages).toBe(3)
        expect(wrapper.vm.paginatedLinks.length).toBe(5)

        wrapper.vm.currentListPage = 2
        expect(wrapper.vm.paginatedLinks.length).toBe(5)

        wrapper.vm.currentListPage = 3
        expect(wrapper.vm.paginatedLinks.length).toBe(2)
    })

    // Test link deletion
    it('deletes a link correctly', async () => {
        const link = {
            id: 1,
            title: 'Test Link',
            url: 'https://test.com',
            votes: 0,
            timestamp: Date.now(),
            lastVoted: Date.now()
        }
        wrapper.vm.links = [link]
        wrapper.vm.linkToDelete = link

        await wrapper.vm.confirmDelete()
        expect(wrapper.vm.links).toHaveLength(0)
    })

    // Test toast messages
    it('shows and hides toast messages', async () => {
        wrapper.vm.showToastMessage('Test message')
        expect(wrapper.vm.showToast).toBe(true)
        expect(wrapper.vm.toastMessage).toBe('Test message')

        // Wait for toast to disappear
        await new Promise(resolve => setTimeout(resolve, 3100))
        expect(wrapper.vm.showToast).toBe(false)
    })
})
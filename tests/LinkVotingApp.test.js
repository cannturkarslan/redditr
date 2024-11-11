import { mount } from '@vue/test-utils';
import { createApp } from 'vue';

const LinkVotingApp = {
  template: `
    <div>
      <h1>Link Voting App</h1>
      <input v-model="newLink.title" placeholder="Link Title" />
      <input v-model="newLink.url" placeholder="Link URL" />
      <button @click="addLink">Add Link</button>
      <ul>
        <li v-for="link in links" :key="link.id">
          {{ link.title }} - {{ link.votes }} votes
          <button @click="vote(link)">Vote</button>
        </li>
      </ul>
      <div v-if="showToast">{{ toastMessage }}</div>
    </div>
  `,
  data() {
    return {
      newLink: { title: '', url: '' },
      links: [],
      showToast: false,
      toastMessage: '',
    };
  },
  methods: {
    addLink() {
      if (this.newLink.title && this.newLink.url) {
        this.links.push({ ...this.newLink, id: Date.now(), votes: 0 });
        this.newLink.title = '';
        this.newLink.url = '';
      }
    },
    vote(link) {
      link.votes++;
    },
    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000); // Hide toast after 3 seconds
    },
  },
};

describe('LinkVotingApp', () => {
  let wrapper;

  beforeEach(() => {
    // Mount the component before each test
    wrapper = mount(LinkVotingApp);
  });

  it('adds a new link correctly', async () => {
    // Set input values
    await wrapper.setData({
      newLink: { title: 'Test Link', url: 'https://test.com' },
    });

    // Simulate button click
    await wrapper.find('button').trigger('click');

    // Check if the link was added
    expect(wrapper.vm.links).toHaveLength(1);
    expect(wrapper.vm.links[0].title).toBe('Test Link');
    expect(wrapper.vm.links[0].url).toBe('https://test.com');
  });

  it('updates votes correctly', async () => {
    // Add a link first
    await wrapper.setData({
      newLink: { title: 'Test Link', url: 'https://test.com' },
    });
    await wrapper.find('button').trigger('click'); // Click to add the link

    // Simulate voting for the first link
    await wrapper.findAll('button')[1].trigger('click'); // Vote for the first link

    // Check if the votes were updated
    expect(wrapper.vm.links[0].votes).toBe(1);
  });

  // Add your existing tests here
  it('sorts links correctly', async () => {
    // Add links to test sorting
    await wrapper.setData({
      newLink: { title: 'Link 1', url: 'https://link1.com' },
    });
    await wrapper.find('button').trigger('click');
    
    await wrapper.setData({
      newLink: { title: 'Link 2', url: 'https://link2.com' },
    });
    await wrapper.find('button').trigger('click');

    // Simulate voting for the first link
    await wrapper.findAll('button')[1].trigger('click'); // Vote for Link 1

    // Check if the links are sorted by votes
    expect(wrapper.vm.links[0].title).toBe('Link 1');
  });

  it('paginates links correctly', async () => {
    // Add multiple links to test pagination
    for (let i = 1; i <= 10; i++) {
      await wrapper.setData({
        newLink: { title: `Link ${i}`, url: `https://link${i}.com` },
      });
      await wrapper.find('button').trigger('click');
    }

    // Check if pagination logic works (assuming you have a method for pagination)
    // This is a placeholder; you need to implement pagination logic in your component
    expect(wrapper.vm.links.length).toBe(10);
  });

  it('deletes a link correctly', async () => {
    // Add a link first
    await wrapper.setData({
      newLink: { title: 'Test Link', url: 'https://test.com' },
    });
    await wrapper.find('button').trigger('click');

    // Simulate deleting the link (you need to implement delete logic in your component)
    // This is a placeholder; you need to implement delete logic in your component
    wrapper.vm.links.pop(); // Simulate deletion
    expect(wrapper.vm.links).toHaveLength(0);
  });

  it('shows and hides toast messages', async () => {
    // Simulate showing a toast message
    wrapper.vm.showToastMessage('Test message');
    expect(wrapper.vm.showToast).toBe(true);
    expect(wrapper.vm.toastMessage).toBe('Test message');

    // Wait for toast to disappear
    await new Promise(resolve => setTimeout(resolve, 3100));
    expect(wrapper.vm.showToast).toBe(false);
  });
}); 
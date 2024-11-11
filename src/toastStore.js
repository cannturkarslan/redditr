import { reactive } from 'vue'

export const toastStore = reactive({
    show: false,
    message: '',
    showToast(message) {
        this.message = message
        this.show = true
        setTimeout(() => {
            this.show = false
            this.message = ''
        }, 3000)
    }
}) 
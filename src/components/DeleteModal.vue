<template>
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Remove Link</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Do you want to remove:</p>
                    <h4>{{ link?.title }}</h4>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-dark" @click="confirm">OK</button>
                    <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">CANCEL</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeleteModal',
    props: {
        link: Object
    },
    data() {
        return {
            modal: null
        }
    },
    methods: {
        confirm() {
            this.$emit('confirm')
        },
        show() {
            this.modal.show()
        },
        hide() {
            this.modal.hide()
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$el)
    },
    beforeUnmount() {
        if (this.modal) {
            this.modal.dispose()
        }
    }
}
</script> 
<template>
    <Transition name="fade">
        <div v-show="show" class="toast-component toast-container position-fixed top-0 start-50 translate-middle-x p-3">
            <div class="toast show bg-success text-white" role="alert">
                <div class="toast-body d-flex align-items-center">
                    <i class="bi bi-check-circle me-2"></i>
                    {{ message }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    name: 'Toast',
    props: {
        show: Boolean,
        message: String
    }
}
</script> 
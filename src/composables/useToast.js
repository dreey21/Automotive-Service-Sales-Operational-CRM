import { ref } from "vue"

export function useToast(){

    const showToast = ref(false)
    const toastMessage = ref('')
    const toastVariant = ref('success')

    function showToastNotification(message, variant = 'success') {
        toastMessage.value = message
        toastVariant.value = variant
        showToast.value = true
    }

    function closeToast(){
        showToast.value = false
    }
    return{
        showToast,
        toastMessage,
        toastVariant,
        showToastNotification,
        closeToast
    }
}
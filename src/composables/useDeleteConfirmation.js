import { ref } from "vue"

export function useDeleteConfirmation(database, clearCache, showToastNotification){
    const showDeleteDialog = ref(false)
    const selectedDeleteId = ref(null)

    function deleteService(id) {
        selectedDeleteId.value = id
        showDeleteDialog.value = true
    }

    function confirmDelete() {
        if (selectedDeleteId.value) {
            const dbIndex = database.findIndex(s => s.id === selectedDeleteId.value)
            if (dbIndex !== -1) database.splice(dbIndex, 1)
            clearCache()
            showToastNotification('Record deleted successfully', 'success')
            selectedDeleteId.value = null
            showDeleteDialog.value = false
        }
    }

    return{
        deleteService,
        confirmDelete,
        showDeleteDialog
    }
}

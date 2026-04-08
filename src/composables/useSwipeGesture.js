import { ref } from 'vue'


export function useSwipeGesture (onCardTap){
    const cardRefs = ref({})
    const buttonRefs = ref({})
    const swipedCardId = ref(null)
    const gestureState = {
    isDragging: {},
    startX: {},
    startY: {},
    currentX: {},
    cardElements: {},
    buttonElements: {}
    }

    function setCardRef(el, serviceId) {
        if (el) cardRefs.value[serviceId] = el
    }

    function setButtonRef(el, serviceId, buttonType) {
    if (el) {
        if (!buttonRefs.value[serviceId]) buttonRefs.value[serviceId] = {}
        buttonRefs.value[serviceId][buttonType] = el
    }
    }

    function handleTouchStart(e, serviceId) {
        const card = cardRefs.value[serviceId]
        if (!card) return
        gestureState.cardElements[serviceId] = card
        gestureState.buttonElements[serviceId] = buttonRefs.value[serviceId]
        gestureState.startX[serviceId] = e.touches[0].clientX
        gestureState.startY[serviceId] = e.touches[0].clientY
        gestureState.isDragging[serviceId] = false
        const currentTransform = card.style.transform || 'translate3d(0px, 0, 0)'
        const match = currentTransform.match(/translate3d\(([-\d.]+)px/)
        gestureState.currentX[serviceId] = match ? parseFloat(match[1]) : 0
    }

    function closeSwipe(serviceId) {
        const card = cardRefs.value[serviceId]
        const buttons = buttonRefs.value[serviceId]
        if (card) {
            card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)'
            card.style.transform = 'translate3d(0px, 0, 0)'
        }
        if (buttons) {
            if (buttons.edit) buttons.edit.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'
            if (buttons.delete) buttons.delete.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'
            updateButtonVisibility(serviceId, 0)
        }
        swipedCardId.value = null
    }

    function updateButtonVisibility(serviceId, revealPercent) {
        const buttons = gestureState.buttonElements[serviceId] || buttonRefs.value[serviceId]
        if (!buttons) return
        const opacity = revealPercent
        const scale = 0.8 + (revealPercent * 0.2)
        if (buttons.edit) {
            buttons.edit.style.willChange = revealPercent > 0 ? 'opacity, transform' : 'auto'
            buttons.edit.style.opacity = opacity
            buttons.edit.style.transform = `scale(${scale})`
        }
        if (buttons.delete) {
            buttons.delete.style.willChange = revealPercent > 0 ? 'opacity, transform' : 'auto'
            buttons.delete.style.opacity = opacity
            buttons.delete.style.transform = `scale(${scale})`
        }
    }

    function handleTouchEnd(e, serviceId) {
        const state = gestureState
        if (!state.isDragging[serviceId]) {
            delete state.isDragging[serviceId]
            return
        }
        const card = state.cardElements[serviceId]
        if (!card) return
        const currentTransform = card.style.transform
        const match = currentTransform.match(/translate3d\(([-\d.]+)px/)
        const currentX = match ? parseFloat(match[1]) : 0
        card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)'
        if (currentX < -68) {
            card.style.transform = 'translate3d(-136px, 0, 0)'
            swipedCardId.value = serviceId
            requestAnimationFrame(() => updateButtonVisibility(serviceId, 1))
        } else {
            card.style.transform = 'translate3d(0px, 0, 0)'
            swipedCardId.value = null
            requestAnimationFrame(() => updateButtonVisibility(serviceId, 0))
        }
        delete state.isDragging[serviceId]
        delete state.startX[serviceId]
        delete state.startY[serviceId]
        delete state.currentX[serviceId]
        delete state.cardElements[serviceId]
        delete state.buttonElements[serviceId]
    }
    
    function handleCardClick(service) {
        if (!gestureState.isDragging[service.id]) {
            if (swipedCardId.value === service.id) closeSwipe(service.id)
            else onCardTap(service)
        }
    }

    function closeOpenSwipe(){
        if (swipedCardId.value !== null){
            closeSwipe(swipedCardId.value)
        }
    }

    function handleTouchMove(e, serviceId) {
        const state = gestureState
        if (!state.startX[serviceId]) return
        const currentX = e.touches[0].clientX
        const currentY = e.touches[0].clientY
        const deltaX = currentX - state.startX[serviceId]
        const deltaY = currentY - state.startY[serviceId]
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            if (!state.isDragging[serviceId]) {
            state.isDragging[serviceId] = true
            const card = state.cardElements[serviceId]
            if (card) card.style.transition = 'none'
            }
            e.preventDefault()
            const card = state.cardElements[serviceId]
            if (!card) return
            const startX = state.currentX[serviceId] || 0
            let newX = startX + deltaX
            const maxSwipe = -136
            newX = Math.max(maxSwipe, Math.min(0, newX))
            card.style.transform = `translate3d(${newX}px, 0, 0)`
            const revealPercent = Math.abs(newX) / Math.abs(maxSwipe)
            requestAnimationFrame(() => { updateButtonVisibility(serviceId, revealPercent) })
        }
    }

    return{
        setCardRef,
        setButtonRef,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleCardClick,
        closeSwipe,
        closeOpenSwipe,
    }
}
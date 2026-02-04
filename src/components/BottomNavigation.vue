<template>
  <!-- Only show on mobile, completely hidden on desktop -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-muted shadow-2xl z-50">
    <div class="container mx-auto">
      <div class="flex">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.path"
          class="flex-1 flex flex-col items-center justify-center py-2 px-2 transition-all duration-300 relative group"
          :class="{ 'text-[var(--accent)]': isActive(tab.path), 'text-muted-foreground hover:text-foreground': !isActive(tab.path) }"
        >
          <!-- Icon with background circle -->
          <div :class="['relative p-1.5 rounded-lg mb-0.5', isActive(tab.path) ? 'bg-[var(--accent)]/20' : 'bg-transparent group-hover:bg-muted']">
            <component :is="getIcon(tab.icon)" class="w-5 h-5" />
            <div v-if="isActive(tab.path)" class="absolute inset-0 rounded-lg bg-[var(--accent)]/10 animate-pulse" />
          </div>
          <span :class="['text-[10px] font-medium tracking-wide', isActive(tab.path) ? 'text-[var(--accent)] font-semibold' : 'text-muted-foreground group-hover:text-foreground']">
            {{ tab.label }}
          </span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  tabs: { type: Array, required: true }
})

const route = useRoute()

const iconMap = { UsersIcon, ClipboardDocumentListIcon, HomeIcon, ChartBarIcon, Cog6ToothIcon }

function getIcon(name) {
  return iconMap[name] || UsersIcon
}

function isActive(path) {
  return route.path === path
}
</script>
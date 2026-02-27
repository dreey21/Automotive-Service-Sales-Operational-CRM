<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-brand-navy border-t border-border z-50">
    <div class="flex">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.id"
        :to="tab.path"
        :aria-current="isActive(tab.path) ? 'page' : undefined"
        :aria-label="tab.label"
        class="flex-1 flex flex-col items-center justify-center py-2.5 px-2 transition-all duration-200 relative"
        :class="isActive(tab.path) ? 'text-brand-navy' : 'text-brand-ice hover:text-white'"
      >
        <!-- Active background pill -->
        <div
          :class="[
            'relative p-1.5 rounded-lg mb-0.5 transition-colors duration-200',
            isActive(tab.path) ? 'bg-brand-sky/40' : 'bg-transparent'
          ]"
        >
          <component :is="getIcon(tab.icon)" class="w-5 h-5" />
        </div>

        <span
          :class="[
            'text-[10px] tracking-wide transition-colors duration-200',
            isActive(tab.path) ? 'text-brand-sky font-semibold' : 'text-brand-ice font-medium'
          ]"
        >
          {{ tab.label }}
        </span>
      </RouterLink>
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
  return iconMap[name] || HomeIcon
}

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
<template>
  <aside 
    class="hidden md:flex md:flex-col fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 z-40 transition-[width] duration-300 ease-in-out"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo Section - Now 68px height with proper vertical padding -->
    <div class="border-b border-gray-800 overflow-hidden h-[68px] flex items-center px-5">
      <div class="flex items-center" :class="isCollapsed ? '' : 'gap-3'">
        <img 
          src="/assets/logo.png" 
          alt="4DM Auto Care Center" 
          class="w-8 h-8 object-contain flex-shrink-0"
        />
        <div v-if="!isCollapsed" class="flex-1 min-w-0">
          <h1 class="text-base font-bold text-white leading-tight whitespace-nowrap">
            <span class="text-red-500">4DM</span>
            <span class="font-semibold text-gray-400 mt-0.5"> Auto Care Center</span>
          </h1>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden px-3">
      <ul class="space-y-1">
        <li v-for="tab in tabs" :key="tab.id">
          <RouterLink
            :to="tab.path"
            class="flex items-center rounded-lg text-sm font-medium transition-colors relative overflow-hidden px-3 py-2.5"
            :class="[
              isActive(tab.path)
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            ]"
            :title="isCollapsed ? tab.label : ''"
          >
            <!-- Icon - always left-aligned with same padding -->
            <div 
              class="flex-shrink-0 transition-colors w-5 h-5"
              :class="isActive(tab.path) ? 'text-[var(--accent)]' : 'text-gray-500 hover:text-gray-400'"
            >
              <component :is="getIcon(tab.icon)" class="w-full h-full" />
            </div>
            
            <!-- Label with gap -->
            <span v-if="!isCollapsed" class="ml-3 whitespace-nowrap flex-1">
              {{ tab.label }}
            </span>

            <!-- Subtle active indicator -->
            <div 
              v-if="isActive(tab.path) && !isCollapsed"
              class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] ml-auto"
            />
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
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
  tabs: { type: Array, required: true },
  isCollapsed: { type: Boolean, default: false }
})

const route = useRoute()

const iconMap = {
  UsersIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon
}

function getIcon(name) {
  return iconMap[name] || HomeIcon
}

function isActive(path) {
  return route.path === path
}
</script>

<style scoped>
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
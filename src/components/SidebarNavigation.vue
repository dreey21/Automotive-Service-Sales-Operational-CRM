<template>
  <aside 
    class="hidden md:flex md:flex-col fixed left-0 top-0 h-screen bg-[var(--foreground)] border-r border-border z-40 transition-[width] duration-300 ease-in-out overflow-hidden"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Logo Section -->
    <div class="border-b border-border h-[68px] flex items-center pl-2 pr-2">
      <!-- Logo always pinned to the left, never moves -->
      <img 
        src="/assets/logo.png" 
        alt="4DM Auto Care Center" 
        class="w-16 h-16 object-contain flex-shrink-0"
      />
      <!-- Text collapses independently -->
      <div 
        class="overflow-hidden transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100'"
      >
        <div>
          <p class="text-2xl whitespace-nowrap text-white italic" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; letter-spacing: 0.05em;">4DM</p>
          <p class="text-[14px] font-semibold whitespace-nowrap text-brand-ice leading-tight uppercase tracking-widest" style="font-family: 'Barlow Condensed', sans-serif; font-weight: 600;">Auto Care Center</p>
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
                ? 'bg-brand-sky text-brand-navy'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            :title="isCollapsed ? tab.label : ''"
          >
            <!-- Icon -->
            <div 
              class="flex-shrink-0 transition-colors w-5 h-5"
              :class="isActive(tab.path) ? 'text-brand-navy' : 'text-brand-ice'"
            >
              <component :is="getIcon(tab.icon)" class="w-full h-full" />
            </div>
            
            <!-- Label -->
            <span 
              class="ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"
              :class="isCollapsed ? 'w-0 opacity-0 ml-0' : 'flex-1 opacity-100'"
            >
              {{ tab.label }}
            </span>

            <!-- Active indicator dot -->
            <div 
              v-if="isActive(tab.path)"
              class="w-1.5 h-1.5 rounded-full bg-brand-navy ml-auto flex-shrink-0 transition-all duration-300"
              :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
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
  background: #A8C4D4;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #7BA7BC;
}
</style>
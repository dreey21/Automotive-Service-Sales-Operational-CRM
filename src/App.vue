<template>
  <div class="min-h-screen bg-gray-950 flex">
    <!-- Sidebar Navigation (Desktop) -->
    <SidebarNavigation :tabs="navigationTabs" :is-collapsed="isSidebarCollapsed" />

    <!-- Main Content Area -->
    <div 
      class="flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out"
      :class="isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'"
    >
      <!-- Dynamic Header -->
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="h-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <RouterView :is-sidebar-collapsed="isSidebarCollapsed" :all-services="mockDatabase" />
        </div>
      </main>
    </div>

    <!-- Bottom Navigation (Mobile) -->
    <BottomNavigation :tabs="navigationTabs" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BottomNavigation from './components/BottomNavigation.vue'
import SidebarNavigation from './components/SidebarNavigation.vue'
import AppHeader from './components/AppHeader.vue'
import { mockDatabase } from './data/mockData'
const navigationTabs = [
  { id: 'home', label: 'Dashboard', icon: 'HomeIcon', path: '/' },
  { id: 'records', label: 'Sales', icon: 'ClipboardDocumentListIcon', path: '/sales' },
  { id: 'reports', label: 'Reports', icon: 'ChartBarIcon', path: '/reports' },
  { id: 'account', label: 'Account', icon: 'Cog6ToothIcon', path: '/account' },
]

// Sidebar collapse state
const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>
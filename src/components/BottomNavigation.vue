<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 bg-brand-navy border-t border-border z-50"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="flex items-stretch">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.id"
        :to="tab.path"
        :aria-current="isActive(tab.path) ? 'page' : undefined"
        :aria-label="tab.label"
        class="flex-1 flex flex-col items-center justify-center py-3 px-1.5 transition-colors duration-200 relative"
        :class="isActive(tab.path) ? 'text-white' : 'text-white/40 hover:text-white/70'"
      >
        <!-- Icon: swap outline → solid on active -->
        <div class="relative z-10 mb-1">
          <component
            :is="isActive(tab.path) ? getSolidIcon(tab.icon) : getIcon(tab.icon)"
            class="w-6 h-6 transition-all duration-200"
          />
        </div>

        <!-- Label -->
        <span
          class="relative z-10 text-[11px] tracking-wide leading-none"
          :class="isActive(tab.path) ? 'font-semibold text-white' : 'font-medium'"
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
import {
  UsersIcon as UsersIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/vue/24/solid'

const props = defineProps({
  tabs: { type: Array, required: true }
})

const route = useRoute()

const outlineIconMap = {
  UsersIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon
}

const solidIconMap = {
  UsersIcon: UsersIconSolid,
  ClipboardDocumentListIcon: ClipboardDocumentListIconSolid,
  HomeIcon: HomeIconSolid,
  ChartBarIcon: ChartBarIconSolid,
  Cog6ToothIcon: Cog6ToothIconSolid
}

function getIcon(name) {
  return outlineIconMap[name] || HomeIcon
}

function getSolidIcon(name) {
  return solidIconMap[name] || HomeIconSolid
}

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
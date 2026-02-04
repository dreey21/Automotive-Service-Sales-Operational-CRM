import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import Dashboard from '../views/Dashboard.vue'
import SalesRecordList from '../views/SalesRecordList.vue'
import Reports from '../views/Reports.vue'
import Accounts from '../views/Accounts.vue'

// Define routes
const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/sales', name: 'sales', component: SalesRecordList },
  { path: '/reports', name: 'reports', component: Reports },
  { path: '/account', name: 'account', component: Accounts },
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
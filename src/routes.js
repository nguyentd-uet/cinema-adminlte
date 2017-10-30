import DashView from './components/admin/Dash.vue'
import LoginView from './components/admin/Login.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/admin/views/Dashboard.vue'
import TablesView from './components/admin/views/Tables.vue'
import TasksView from './components/admin/views/Tasks.vue'
import SettingView from './components/admin/views/Setting.vue'
import AccessView from './components/admin/views/Access.vue'
import ServerView from './components/admin/views/Server.vue'
import ReposView from './components/admin/views/Repos.vue'
import CinemaView from './components/admin/views/Cinema.vue'

// Routes
const routes = [
  {
    path: '/admin/login',
    component: LoginView
  },
  {
    path: '/admin/',
    component: DashView,
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: {description: 'Overview of environment'}
      },
      {
        path: 'tables',
        component: TablesView,
        name: 'Tables',
        meta: {description: 'Simple and advance table in CoPilot'}
      },
      {
        path: 'tasks',
        component: TasksView,
        name: 'Tasks',
        meta: {description: 'Tasks page in the form of a timeline'}
      },
      {
        path: 'setting',
        component: SettingView,
        name: 'Settings',
        meta: {description: 'User settings page'}
      },
      {
        path: 'access',
        component: AccessView,
        name: 'Access',
        meta: {description: 'Example of using maps'}
      },
      {
        path: 'server',
        component: ServerView,
        name: 'Servers',
        meta: {description: 'List of our servers', requiresAuth: true}
      },
      {
        path: 'repos',
        component: ReposView,
        name: 'Repository',
        meta: {description: 'List of popular javascript repos'}
      },
      {
        path: 'cinema',
        component: CinemaView,
        name: 'Cinema',
        meta: {description: 'Quản lý rạp chiếu'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes

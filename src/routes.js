import DashView from './components/admin/Dash.vue'
import LoginView from './components/admin/Login.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/admin/views/Dashboard.vue'
import CinemaView from './components/admin/views/Cinema.vue'
import EmployeeView from './components/admin/views/Employee.vue'
import MovieView from './components/admin/views/Movie.vue'
import RoomView from './components/admin/views/Room.vue'
import ScheduleView from './components/admin/views/Schedule.vue'
import TicketView from './components/admin/views/Ticket.vue'
import UserView from './components/admin/views/User.vue'

// Routes
const routes = [
  {
    path: '/admin/login',
    component: LoginView
  },
  {
    path: '/admin/',
    component: DashView,
    meta: {requiresAuth: true},
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: {description: 'Overview of environment'}
      },
      {
        path: 'user',
        component: UserView,
        name: 'User',
        meta: {description: 'Quản lý thành viên'}
      },
      {
        path: 'movie',
        component: MovieView,
        name: 'Movie',
        meta: {description: 'Quản lý phim'}
      },
      {
        path: 'schedule',
        component: ScheduleView,
        name: 'Schedule',
        meta: {description: 'Quản lý lịch chiếu'}
      },
      {
        path: 'ticket',
        component: TicketView,
        name: 'Ticket',
        meta: {description: 'Quản lý vé'}
      },
      {
        path: 'cinema',
        component: CinemaView,
        name: 'Cinema',
        meta: {description: 'Quản lý rạp chiếu'}
      },
      {
        path: 'room',
        component: RoomView,
        name: 'Room',
        meta: {description: 'Quản lý phòng chiếu'}
      },
      {
        path: 'employee',
        component: EmployeeView,
        name: 'Employee',
        meta: {description: 'Quản lý nhân viên'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes

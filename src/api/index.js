import axios from 'axios'
import config from '../config'
// import state from '../store/state'

const baseURL = config.serverURI
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
export default {
  login: baseURL + '/User/Login',
  movie: baseURL + '/Movie/',
  cinema: baseURL + '/Cinema/',
  room: baseURL + '/Room/',
  getUserList: baseURL + '/User/List',
  register: baseURL + '/User/Register',
  setRole: baseURL + '/User/SetRole',
  user: baseURL + '/User/',
  schedule: baseURL + '/Schedule/',
  ticket: baseURL + '/Ticket/'
}

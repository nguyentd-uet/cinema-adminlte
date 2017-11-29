<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
          <img src="/static/img/logo.png" class="center-block logo">
          <div class="text-center col-md-4 col-sm-offset-4">
            <!-- login form -->
            <form class="ui form loginForm"  @submit.prevent="checkCreds">

              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
                <input class="form-control" name="email" placeholder="Email" type="text" v-model="email">
              </div>

              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                <input class="form-control" name="password" placeholder="Password" type="password" v-model="password">
              </div>
              <button type="submit" v-bind:class="'btn btn-primary btn-lg ' + loading">Submit</button>
            </form>

            <!-- errors -->
            <div v-if=response class="text-red"><p>{{response}}</p></div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import api from '../../api'
import axios from 'axios'

export default {
  name: 'Login',
  data (router) {
    return {
      section: 'Login',
      loading: '',
      email: '',
      password: '',
      response: ''
    }
  },
  methods: {
    checkCreds () {
      this.toggleLoading()
      this.resetResponse()
      this.$store.commit('TOGGLE_LOADING')

      /* Making API call to authenticate a user */
      axios.post(api.login + '?email=' + this.email + '&password=' + this.password)
      .then(response => {
        this.toggleLoading()

        var data = response.data
        /* Checking if error object was returned from the server */
        console.log(data)

        /* Setting user in the state and caching record to the localStorage */
        if (data.token) {
          var token = 'Bearer ' + data.token

          this.$store.commit('SET_USER', JSON.stringify(data))
          this.$store.commit('SET_TOKEN', token)

          if (window.localStorage) {
            window.localStorage.setItem('user', JSON.stringify(data))
            window.localStorage.setItem('token', token)
          }

          window.location.assign('/admin')
        }
      })
      .catch(error => {
        this.$store.commit('TOGGLE_LOADING')
        console.log(error.response)

        if (error.response && error.response.statusText === 'Bad Request') {
          this.response = 'Invalid Login'
        }
        this.toggleLoading()
      })
    },
    toggleLoading () {
      this.loading = (this.loading === '') ? 'loading' : ''
    },
    resetResponse () {
      this.response = ''
    }
  }
}
</script>

<style>
html, body, .container-table {
  height: 100%;
  background-color: #282B30 !important;
}
.container-table {
    display: table;
    color: white;
}
.vertical-center-row {
    display: table-cell;
    vertical-align: middle;
}
.vertical-20p {
  padding-top: 20%;
}
.vertical-10p {
  padding-top: 10%;
}
.logo {
  width: 15em;
  padding: 3em;
}
.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}
.input-group input {
  height: 4em;
}
</style>

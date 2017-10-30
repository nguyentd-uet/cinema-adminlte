<template>
  <notify-me
		container="notification"
    :event-bus="bus">
    <template slot="content" slot-scope="{data}">
        <div class="alert-text">
					<h4><b>{{data.title}}</b></h4>
					<p style="margin: 0">{{data.text}}</p>
        </div>
    </template>
	</notify-me>
</template>

<script>
import Notify from 'vue-notify-me'

export default {
  name: 'notify',
  components: {
    'notify-me': Notify
  },
  data () {
    return {
      status: 'alert-success',
      title: 'Success :)',
      text: 'Thanh cong'
    }
  },
  methods: {
    showMe () {
			this.bus.$emit('notify-me', {
				status: this.status,
				data: {
					title: this.title,
					text: this.text
				}
			})
		},
		hideMe () {
			this.bus.$emit('hide-notify-me')
		}
	}
}
</script>

<style scoped>
.alert-text {
	width: 100%;
	word-break: break-all;
	text-align: left;
	padding: 10px;
}
</style>


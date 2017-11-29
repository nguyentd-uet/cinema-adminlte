<template>
  <section class="content">
    <notify></notify>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Danh sách thành viên</h3>
            <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#modal" @click="showAddModal">Thêm thành viên</button>
          </div>

          <!-- Modal -->
          <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" id="modalLabel">{{ modalTitle }}</h4>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label for="name" class="control-label">Tên user:</label>
                      <input type="text" class="form-control" id="name" v-model="name" required>
                    </div>
                    <div class="form-group" :class="emailError ? 'has-error' : null" v-if="modalTitle==='Thêm thành viên'">
                      <label for="email" class="control-label">Email:</label>
                      <input type="email" class="form-control" id="email" v-model="email" required @change="checkEmail">
                      <span class="help-block" v-if="emailError">Email không đúng định dạng</span>
                    </div>
                    <div class="form-group" v-if="modalTitle==='Thêm thành viên'">
                      <label for="password" class="control-label">Password:</label>
											<div class="input-group">
                      	<input v-if="!showPassword" type="password" class="form-control password" v-model="password" required>
												<input v-if="showPassword" type="text" class="form-control password" v-model="password" required>
												<span class="input-group-btn">
													<button class="btn btn-default" type="button" @click="showPassword = !showPassword">
														<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
													</button>
												</span>
											</div>
                    </div>
                    <div class="form-group">
                      <label for="avatar" class="control-label">Avatar:</label>
                      <input type="text" class="form-control" id="avatar" v-model="avatar">
                    </div>
										<div class="form-group">
                      <label for="address" class="control-label">Địa chỉ:</label>
                      <input type="text" class="form-control" id="address" v-model="address">
                    </div>
                    <div class="form-group">
                      <label for="role" class="control-label">Role:</label>
                      <select class="form-control" id="role" v-model="role">
                        <option v-for="item in roles" :key="item.id"  :value="item.name">{{ item.name }}</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button type="submit" class="btn btn-primary" @click="postUser" v-if="modalTitle==='Thêm thành viên'">OK</button>
                  <button type="submit" class="btn btn-primary" @click="editUser" v-if="modalTitle!=='Thêm thành viên'">Sửa</button>
                </div>
              </div>
            </div>
          </div>

          <!-- /.box-header -->
          <div class="box-body">
            <div class="dataTables_wrapper form-inline dt-bootstrap" id="example1_wrapper">
              <div class="row">
                <div class="col-sm-6">
                  <div id="example1_length" class="dataTables_length">

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12 table-responsive">
                  <table aria-describedby="example1_info" role="grid" id="example1" class="table table-bordered table-striped dataTable">
                    <thead>
                      <tr role="row">
                        <th aria-sort="ascending" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting_asc">STT</th>
                        <th colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting" 
                            v-for="thead in theads" :key="thead">{{thead}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in users" :key="item.id" :id="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.email }}</td>
												<td>
													<img class="avatar" :src="item.avatar || avatarDefault" data-toggle="modal" data-target="#modal2">
												</td>
												<td>{{ item.address || 'null' }}</td>
                        <td>{{ item.role[0] }}</td>
                        <td>
                          <button type="button" class="btn btn-primary" aria-label="Left Align"
                            data-toggle="modal" data-target="#modal" @click="showEditModal(index, item.id)">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                          </button>
                          <button type="button" class="btn btn-danger" aria-label="Left Align"
                            @click="deleteConfirm(index, item.id)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>  
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="1" rowspan="1">STT</th>
                        <th colspan="1" rowspan="1" v-for="thead in theads" :key="thead">{{thead}}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery'
// Require needed datatables modules
import 'datatables.net'
import 'datatables.net-bs'
import api from '../../../api'
import notify from '../notify'
import axios from 'axios'
import {roles} from '../../../constant'

export default {
  name: 'User',
  components: {
    notify
  },
  data () {
    return {
			users: [],
			theads: ['Tên', 'Email', 'Avatar', 'Địa chỉ', 'Role', 'Hành động'],
			roles: roles,
			showPassword: false,
			emailError: false,
      name: '',
			address: '',
      email: '',
      avatar: '',
			password: '',
			role: '',
			modalTitle: '',
			idUser: 0,
			index: 0,
      avatarDefault: '../../../../static/img/default.jpg'
    }
  },
  beforeMount () {
    this.drawDatatable()
  },
  methods: {
    getUsers () {
      axios.get(api.getUserList)
      .then(response => {
        var data = response.data
        console.log(data)
        this.users = data
      })
      .catch(error => {
        console.log(error)
      })
    },
    drawDatatable () {
      this.getUsers()
      setTimeout(() => {
        $('#example1').DataTable()
      }, 2000)
    },
    showAddModal () {
      this.modalTitle = 'Thêm thành viên'
      this.emailError = false
      this.name = ''
      this.address = ''
      this.email = ''
      this.password = ''
      this.role = ''
      this.avatar = ''
    },
    showEditModal (index, id) {
      console.log(index, id)
      this.index = index
      this.idUser = id
      this.modalTitle = 'Sửa thông tin thành viên'
      this.emailError = false
      this.name = this.users[index].name
      this.address = this.users[index].address
      this.email = this.users[index].email
      this.role = this.users[index].role[0]
      this.avatar = this.users[index].avatar
    },
    showNotify (status, title, text) {
      this.bus.$emit('notify-me', {
        status: status,
        data: {
          title: title,
          text: text
        }
      })
    },
    checkEmail () {
      var reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      if (!reg.test(this.email)) {
        this.emailError = true
        return false
      } else {
        this.emailError = false
        return true
      }
    },
    deleteConfirm (index, id) {
      console.log(index, id)
      var confirm = window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')
      if (confirm === true) {
				axios.delete(api.user + id)
        .then(response => {
          console.log(response.data)
          this.users.splice(index, 1)
          $('#example1').DataTable().row($('#' + id)).remove().draw()
          this.showNotify('alert-success', 'Success :)', 'Xóa tài khoản thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        return false
      }
    },
    postUser () {
      if (this.name !== '' && this.email !== '' && this.password !== '' && this.role !== '' && this.checkEmail()) {
				// api.request('post', '/Employee', {name: this.name, email: this.email, password: this.password, role: this.role})
				axios.post(api.register + '?password=' + this.password, {name: this.name, email: this.email, address: this.address, avatar: this.avatar || null})
        .then(response => {
          axios.post(api.setRole + '?email=' + this.email + '&roleName=' + this.role)
          .then(res => { console.log(res) })
          .catch(err => { console.log(err.response) })
          console.log(response.data)
          this.users.push(response.data)
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Thêm tài khoản thành công')
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        this.showNotify('alert-danger', 'Failed :\'(', 'Bạn cần điền đầy đủ thông tin')
      }
    },
    editUser () {
      if (this.name !== '' && this.email !== '' && this.checkEmail()) {
        axios.patch(api.user + this.idUser,
            {name: this.name, address: this.address, avatar: this.avatar || null})
        .then(response => {
          axios.post(api.setRole + '?email=' + this.email + '&roleName=' + this.role)
          .then(res => { console.log(res) })
          .catch(err => { console.log(err.response) })
          console.log(response.data)
          this.users[this.index].name = this.name
          this.users[this.index].address = this.address
          this.users[this.index].role[0] = this.role
          this.users[this.index].avatar = this.avatar
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Sửa thông tin tài khoản thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        this.showNotify('alert-danger', 'Failed :\'(', 'Bạn cần điền đầy đủ thông tin')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import url('/static/js/plugins/datatables/dataTables.bootstrap.css');

  table.dataTable thead .sorting:after,
  table.dataTable thead .sorting_asc:after,
  table.dataTable thead .sorting_desc:after {
    font-family: 'FontAwesome';
  }

  table.dataTable thead .sorting:after {
    content: "\f0dc";
  }

  table.dataTable thead .sorting_asc:after {
    content: "\f0dd";
  }

  table.dataTable thead .sorting_desc:after {
    content: "\f0de";
  }
  .dataTables_empty {
    display: none;
  }
  .alert-text {
    width: 100%;
    word-break: break-all;
    text-align: left;
    padding: 10px;
  }
	.password {
		height: 34px;
	}
  .avatar {
		height: 100px;
		width: 100px;
	}
</style>

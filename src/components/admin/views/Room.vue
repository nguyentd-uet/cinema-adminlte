<template>
  <section class="content">
    <notify></notify>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Danh sách phòng chiếu</h3>
            <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#modal" @click="showAddRoomModal">Thêm phòng</button>
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
                      <label for="name" class="control-label">Tên phòng:</label>
                      <input type="text" class="form-control" id="name" v-model="name" required>
                    </div>
                    <div class="form-group">
                      <label for="seats" class="control-label">Số ghế:</label>
                      <input type="number" class="form-control" id="seats" v-model="seats" min="0" required>
                    </div>
                    <div class="form-group">
                      <label for="cinema" class="control-label">Thuộc rạp:</label>
                      <select class="form-control" id="cinema" v-model="cinema" required>
                        <option v-for="item in cinemas" :value="item.id" :key="item.id">{{ item.name }}</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button type="button" class="btn btn-primary" @click="postRoom" v-if="modalTitle==='Thêm phòng'">OK</button>
                  <button type="button" class="btn btn-primary" @click="editRoom" v-if="modalTitle!=='Thêm phòng'">Sửa</button>
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
                      <tr v-for="(item,index) in rooms" :key="item.id" :id="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.seats }}</td>
                        <td>{{ item.cinema.name }}</td>
                        <td>
                          <button type="button" class="btn btn-primary" aria-label="Left Align"
                            data-toggle="modal" data-target="#modal" @click="showEditRoomModal(index, item.id)">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                          </button>
                          <button type="button" class="btn btn-danger" aria-label="Left Align"
                            @click="deleteRoomConfirm(index, item.id)">
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

export default {
  name: 'Room',
  components: {
    notify
  },
  data () {
    return {
			rooms: [],
			cinemas: [],
      theads: ['Tên phòng', 'Số ghế', 'Tên rạp', 'Hành động'],
      name: '',
			seats: null,
			cinema: null,
      modalTitle: '',
      idRoom: 0,
      index: 0
    }
  },
  beforeMount () {
		this.drawDatatable()
		this.getCinemas()
  },
  methods: {
    getRooms () {
      axios.get(api.room)
      .then(response => {
        var data = response.data
        console.log(data)
        this.rooms = data
      })
      .catch(error => {
        console.log(error)
      })
		},
		getCinemas () {
			axios.get(api.cinema)
      .then(response => {
        this.cinemas = response.data
        console.log(this.cinemas)
      })
      .catch(error => {
        console.log(error)
      })
		},
    drawDatatable () {
      this.getRooms()
      setTimeout(() => {
        $('#example1').DataTable()
      }, 2000)
    },
    showAddRoomModal () {
      this.modalTitle = 'Thêm phòng'
      this.name = ''
			this.seats = null
			this.cinema = null
    },
    showEditRoomModal (index, id) {
      console.log(index, id)
      this.index = index
      this.idRoom = id
      this.modalTitle = 'Sửa thông tin phòng'
      this.name = this.rooms[index].name
			this.seats = this.rooms[index].seats
			this.cinema = this.rooms[index].cinemaId
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
    deleteRoomConfirm (index, id) {
      console.log(index, id)
      var confirm = window.confirm('Bạn có chắc chắn muốn xóa phòng?')
      if (confirm === true) {
        axios.delete(api.room + id)
        .then(response => {
          console.log(response.data)
          this.rooms.splice(index, 1)
          $('#example1').DataTable().row($('#' + id)).remove().draw()
          this.showNotify('alert-success', 'Success :)', 'Xóa phòng thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        return false
      }
    },
    postRoom () {
      if (this.name !== '' && this.seats !== null && this.seats > 0 && this.cinema !== null) {
        // api.request('post', '/Cinema', {name: this.name, address: this.address})
        axios.post(api.room, {name: this.name, seats: this.seats, cinemaId: this.cinema})
        .then(response => {
          console.log(response.data)
          this.rooms.push(response.data)
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Thêm phòng thành công')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        this.showNotify('alert-danger', 'Failed :\'(', 'Bạn cần điền đầy đủ thông tin')
      }
    },
    editRoom () {
      if (this.name !== '' && this.seats !== null && this.seats > 0 && this.cinema !== null) {
        axios.patch(api.room + this.idRoom, {name: this.name, seats: this.seats, cinemaId: this.cinema})
        .then(response => {
          console.log(response.data)
          this.rooms[this.index].name = this.name
					this.rooms[this.index].seats = this.seats
          this.rooms[this.index].cinemaId = this.cinema
          this.cinemas.map((cinema) => {
            if (cinema.id === this.cinema) {
              this.rooms[this.index].cinema = cinema
            }
          })
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Sửa thông tin phòng thành công')
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

</style>

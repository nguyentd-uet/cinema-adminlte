<template>
  <section class="content">
    <notify></notify>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Danh sách lịch chiếu</h3>
            <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#modal" @click="showAddScheduleModal">Thêm lịch chiếu</button>
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
                      <label for="movie" class="control-label">Chọn phim:</label>
                      <select class="form-control" id="movie" v-model="movie" required>
                        <option v-for="item in movies" :value="item.id" :key="item.id">{{ item.name }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="cinema" class="control-label">Chọn rạp:</label>
                      <select class="form-control" id="cinema" v-model="cinema" required @change="getRooms">
                        <option v-for="item in cinemas" :value="item.id" :key="item.id">{{ item.name }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="room" class="control-label">Chọn phòng chiếu:</label>
                      <select class="form-control" id="room" v-model="room" required>
                        <option v-for="item in rooms" :value="item.id" :key="item.id">{{ item.name }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="time" class="control-label">Thời gian chiếu:</label>
                      <input type="datetime-local" class="form-control" id="time" v-model="showtime" required>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button type="button" class="btn btn-primary" @click="postSchedule" v-if="modalTitle==='Thêm lịch chiếu'">OK</button>
                  <button type="button" class="btn btn-primary" @click="editSchedule" v-if="modalTitle!=='Thêm lịch chiếu'">Sửa</button>
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
                      <tr v-for="(item,index) in schedules" :key="item.id" :id="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.movie.name }}</td>
                        <td>{{ item.room.name }}</td>
                        <td>{{ item.room.cinema.name }}</td>
                        <td>{{ item.showtime }}</td>
                        <td>
                          <button type="button" class="btn btn-primary" aria-label="Left Align"
                            data-toggle="modal" data-target="#modal" @click="showEditScheduleModal(index, item.id)">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                          </button>
                          <button type="button" class="btn btn-danger" aria-label="Left Align"
                            @click="deleteScheduleConfirm(index, item.id)">
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
  name: 'Schedule',
  components: {
    notify
  },
  data () {
    return {
			schedules: [],
      theads: ['Tên phim', 'Tên phòng', 'Tên rạp', 'Thời gian', 'Hành động'],
      movies: [],
      movie: null,
      cinemas: [],
      cinema: null,
      rooms: [],
      room: null,
      showtime: null,
      modalTitle: '',
      idSchedule: 0,
      index: 0
    }
  },
  beforeMount () {
		this.drawDatatable()
    this.getSchedules()
    this.getMovies()
    this.getCinemas()
  },
  methods: {
		getSchedules () {
			axios.get(api.schedule)
      .then(response => {
        var data = response.data
        console.log(data)
        this.schedules = data
      })
      .catch(error => {
        console.log(error)
      })
    },
    getMovies () {
      axios.get(api.movie)
      .then(response => {
        this.movies = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },
    getCinemas () {
      axios.get(api.cinema)
      .then(response => {
        this.cinemas = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },
    getRooms (e) {
      this.cinemas.map((cinema) => {
        if (cinema.id === parseInt(e.target.value)) {
          this.rooms = cinema.rooms
        }
      })
    },
    drawDatatable () {
      this.getSchedules()
      setTimeout(() => {
        $('#example1').DataTable()
      }, 2000)
    },
    showAddScheduleModal () {
      this.modalTitle = 'Thêm lịch chiếu'
      this.movie = null
      this.room = null
      this.cinema = null
      this.showtime = null
    },
    showEditScheduleModal (index, id) {
      console.log(index, id)
      this.index = index
      this.idSchedule = id
      this.modalTitle = 'Sửa thông tin lịch chiếu'
      this.showtime = this.schedules[index].showtime
      this.movie = this.schedules[index].movieId
      this.cinemas.map((cinema) => {
        if (cinema.id === this.schedules[index].room.cinemaId) {
          this.rooms = cinema.rooms
        }
      })
      this.room = this.schedules[index].roomId
      this.cinema = this.schedules[index].room.cinemaId
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
    deleteScheduleConfirm (index, id) {
      console.log(index, id)
      var confirm = window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu?')
      if (confirm === true) {
        axios.delete(api.schedule + id)
        .then(response => {
          console.log(response.data)
          this.schedules.splice(index, 1)
          $('#example1').DataTable().row($('#' + id)).remove().draw()
          this.showNotify('alert-success', 'Success :)', 'Xóa lịch chiếu thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        return false
      }
    },
    postSchedule () {
      if (this.movie !== null && this.room !== null && this.cinema !== null && this.showtime !== null) {
        axios.post(api.schedule, {movieId: this.movie, roomId: this.room, showtime: this.showtime})
        .then(response => {
          console.log(response.data)
          // this.schedules.push(response.data)
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Thêm lịch chiếu thành công')
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
    editSchedule () {
      if (this.movie !== null && this.room !== null && this.cinema !== null && this.showtime !== null) {
        axios.patch(api.schedule + this.idSchedule, {movieId: this.movie, roomId: this.room, showtime: this.showtime})
        .then(response => {
          console.log(response.data)
          // this.schedules[this.index].movieId = this.movie
					// this.schedules[this.index].roomId = this.room
          // this.schedules[this.index].showtime = this.showtime
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Sửa thông tin lịch chiếu thành công')
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

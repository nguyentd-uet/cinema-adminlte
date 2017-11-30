<template>
  <section class="content">
    <notify></notify>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Danh sách vé</h3>
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
                      <label for="seat" class="control-label">Số ghế:</label>
                      <input type="text" class="form-control" id="seat" v-model="seat" required>
                    </div>
										<div class="form-group">
                      <label for="buyDate" class="control-label">Giờ mua:</label>
                      <input type="datetime-local" class="form-control" id="buyDate" v-model="buyDate" required>
                    </div>
                    <div class="form-group">
                      <label for="schedule" class="control-label">Lịch chiếu:</label>
                      <select class="form-control" id="schedule" v-model="schedule" required>
                        <option v-for="item in schedules" :value="item.id" :key="item.id">
													{{ item.id + '-' + item.showtime + '-' + item.movie.name + '-' + item.room.name + '-' + item.room.cinema.name }}
												</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button type="button" class="btn btn-primary" @click="editTicket">Sửa</button>
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
                      <tr v-for="(item,index) in tickets" :key="item.id" :id="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.seat }}</td>
                        <td>{{ item.buyDate }}</td>
                        <td>{{ item.schedule.showtime }}</td>
                        <td>{{ item.schedule.movie.name }}</td>
												<td>{{ item.schedule.room.name }}</td>
                        <td>
                          <button type="button" class="btn btn-primary" aria-label="Left Align"
                            data-toggle="modal" data-target="#modal" @click="showEditTicketModal(index, item.id)">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                          </button>
                          <button type="button" class="btn btn-danger" aria-label="Left Align"
                            @click="deleteTicketConfirm(index, item.id)">
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
  name: 'Ticket',
  components: {
    notify
  },
  data () {
    return {
			tickets: [],
			schedules: [],
      theads: ['Ghế', 'Giờ mua', 'Giờ chiếu', 'Tên phim', 'Tên phòng', 'Hành động'],
			seat: null,
			buyDate: null,
			schedule: null,
      modalTitle: '',
      idTicket: 0,
      index: 0
    }
  },
  beforeMount () {
		this.drawDatatable()
		this.getSchedules()
  },
  methods: {
		getSchedules () {
			axios.get(api.schedule)
      .then(response => {
        this.schedules = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },
		getTickets () {
			axios.get(api.ticket)
      .then(response => {
        var data = response.data
        console.log(data)
        this.tickets = data
      })
      .catch(error => {
        console.log(error)
      })
    },
    drawDatatable () {
      this.getTickets()
      setTimeout(() => {
        $('#example1').DataTable()
      }, 2000)
    },
    showEditTicketModal (index, id) {
      console.log(index, id)
      this.index = index
      this.idTicket = id
      this.modalTitle = 'Sửa thông tin vé'
      this.seat = this.tickets[index].seat
      this.buyDate = this.tickets[index].buyDate
      this.schedule = this.tickets[index].idSchedule
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
    deleteTicketConfirm (index, id) {
      console.log(index, id)
      var confirm = window.confirm('Bạn có chắc chắn muốn xóa vé?')
      if (confirm === true) {
        axios.delete(api.ticket + id)
        .then(response => {
          console.log(response.data)
          this.tickets.splice(index, 1)
          $('#example1').DataTable().row($('#' + id)).remove().draw()
          this.showNotify('alert-success', 'Success :)', 'Xóa vé thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        return false
      }
    },
    editTicket () {
      if (this.seat !== null && this.buyDate !== null && this.schedule !== null) {
        axios.patch(api.ticket + this.idTicket, {seat: this.seat, buyDate: this.buyDate, idSchedule: this.schedule})
        .then(response => {
          console.log(response.data)
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

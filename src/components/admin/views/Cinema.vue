<template>
  <section class="content">
    <notify></notify>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Danh sách rạp chiếu</h3>
            <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#modal" @click="showAddCinemaModal">Thêm rạp</button>
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
                      <label for="name" class="control-label">Tên rạp:</label>
                      <input type="text" class="form-control" id="name" v-model="name" required>
                    </div>
                    <div class="form-group">
                      <label for="address" class="control-label">Địa chỉ:</label>
                      <textarea class="form-control" id="address" v-model="address" required></textarea>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button type="button" class="btn btn-primary" @click="postCinema" v-if="modalTitle==='Thêm rạp'">OK</button>
                  <button type="button" class="btn btn-primary" @click="editCinema" v-if="modalTitle!=='Thêm rạp'">Sửa</button>
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
                        <th aria-sort="ascending" style="width: 30px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting_asc">STT</th>
                        <th style="width: 200px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Tên rạp</th>
                        <th style="width: 282px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Địa chỉ</th>
                        <th style="width: 72px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(cinema,index) in cinemas" :key="cinema.id" :id="cinema.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ cinema.name }}</td>
                        <td>{{ cinema.address }}</td>
                        <td>
                          <button type="button" class="btn btn-primary" aria-label="Left Align"
                            data-toggle="modal" data-target="#modal" @click="showEditCinemaModal(index, cinema.id)">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                          </button>
                          <button type="button" class="btn btn-danger" aria-label="Left Align"
                            @click="deleteCinemaConfirm(index, cinema.id)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>  
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="1" rowspan="1">STT</th>
                        <th colspan="1" rowspan="1">Tên rạp</th>
                        <th colspan="1" rowspan="1">Địa chỉ</th>
                        <th colspan="1" rowspan="1">Hành động</th>
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

export default {
  name: 'Cinema',
  components: {
    notify
  },
  data () {
    return {
      cinemas: [],
      name: '',
      address: '',
      modalTitle: '',
      idCinema: 0,
      index: 0
    }
  },
  beforeMount () {
    this.drawDatatable()
  },
  methods: {
    getCinemas () {
      api.request('get', '/Cinema')
      .then(response => {
        var data = response.data
        console.log(data)
        this.cinemas = data
      })
      .catch(error => {
        console.log(error)
      })
    },
    drawDatatable () {
      this.getCinemas()
      setTimeout(() => {
        $('#example1').DataTable()
      }, 2000)
    },
    showAddCinemaModal () {
      this.modalTitle = 'Thêm rạp'
      this.name = ''
      this.address = ''
    },
    showEditCinemaModal (index, id) {
      console.log(index, id)
      this.index = index
      this.idCinema = id
      this.modalTitle = 'Sửa thông tin rạp'
      this.name = this.cinemas[index].name
      this.address = this.cinemas[index].address
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
    deleteCinemaConfirm (index, id) {
      console.log(index, id)
      var confirm = window.confirm('Bạn có chắc chắn muốn xóa rạp?')
      if (confirm === true) {
        api.request('delete', '/Cinema/' + id)
        .then(response => {
          console.log(response.data)
          this.cinemas.splice(index, 1)
          $('#example1').DataTable().row($('#' + id)).remove().draw()
          this.showNotify('alert-success', 'Success :)', 'Xóa rạp thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        return false
      }
    },
    postCinema () {
      if (this.name !== '' && this.address !== '') {
        api.request('post', '/Cinema', {name: this.name, address: this.address})
        .then(response => {
          console.log(response.data)
          this.cinemas.push(response.data)
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Thêm rạp thành công')
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
    editCinema () {
      if (this.name !== '' && this.address !== '') {
        api.request('put', '/Cinema/' + this.idCinema, {id: this.idCinema, name: this.name, address: this.address})
        .then(response => {
          console.log(response.data)
          this.cinemas[this.index].name = this.name
          this.cinemas[this.index].address = this.address
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Sửa thông tin rạp thành công')
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

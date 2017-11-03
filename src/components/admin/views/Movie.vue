<template>
  <section class="content">
    <notify></notify>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Danh sách phim</h3>
            <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#modal" @click="showAddModal">Thêm phim</button>
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
                      <label for="name" class="control-label">Tên phim:</label>
                      <input type="text" class="form-control" id="name" v-model="name" required>
                    </div>
										<div class="form-group">
                      <label for="poster" class="control-label">Link poster:</label>
                      <input type="text" class="form-control" id="poster" v-model="poster" required>
                    </div>
										<div class="form-group">
                      <label for="trailer" class="control-label">Link trailer:</label>
                      <input type="text" class="form-control" id="trailer" v-model="trailer" required>
                    </div>
										<div class="form-group">
                      <label for="genre" class="control-label">Thể loại:</label>
                      <select class="form-control" id="genre" v-model="genre" required>
												<option v-for="item in genres" :value="item.id" :key="item.id">{{ item.name }}</option>
											</select>
                    </div>
										<div class="form-group">
                      <label for="duration" class="control-label">Độ dài:</label>
                      <input type="text" class="form-control" id="duration" v-model="duration" required>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button type="submit" class="btn btn-primary" @click="postMovie" v-if="modalTitle==='Thêm phim'">OK</button>
                  <button type="submit" class="btn btn-primary" @click="editMovie" v-if="modalTitle!=='Thêm phim'">Sửa</button>
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
                      <tr v-for="(item,index) in movies" :key="item.id" :id="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>
													<img class="poster" :src="item.poster" data-toggle="modal" data-target="#modal2"
                            @click="showModalPoster(item.name, item.poster)">
												</td>
												<td>
                          <a href="#" data-toggle="modal" data-target="#modal2"
                            @click="showModalTrailer(item.name, item.trailer)">
                            {{item.trailer}}
                          </a>
                        </td>
												<td>{{ genres[indexWhere(genres, item.genre)].name }}</td>
												<td>{{ item.duration }}</td>
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

    <!-- Modal poster/trailer -->
    <div class="modal fade" id="modal2" tabindex="-1" role="dialog" aria-labelledby="modalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{ modalTitle }}</h4>
          </div>
          <div class="modal-body row">
            <div class="col-md-12">
              <img :src="posterUrl" v-if="typeModal === 'poster'" class="posterImg">
              <iframe v-if="typeModal === 'trailer'" width="560" height="315" :src="trailerUrl" frameborder="0" allowfullscreen></iframe>
            </div>  
            
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
  name: 'Movie',
  components: {
    notify
  },
  data () {
    return {
			movies: [],
			theads: ['Tên phim', 'Poster', 'Trailer', 'Thể loại', 'Độ dài', 'Hành động'],
			genres: [
				{id: 0, name: 'Hành động'},
				{id: 1, name: 'Khoa học viễn tưởng'},
				{id: 2, name: 'Hài hước'},
				{id: 3, name: 'Kinh dị'},
				{id: 4, name: 'Ma'},
				{id: 5, name: 'Cổ trang'},
				{id: 6, name: 'Kung fu'},
				{id: 7, name: 'Lịch sử'}
			],
			name: '',
			poster: '',
			trailer: '',
			genre: '',
			duration: '00:00:00',
      modalTitle: '',
      idMovie: 0,
      index: 0,
      posterUrl: '',
      trailerUrl: '',
      typeModal: ''
    }
  },
  beforeMount () {
    this.drawDatatable()
  },
  methods: {
    getMovies () {
      api.request('get', '/Movie')
      .then(response => {
        var data = response.data
        console.log(data)
        this.movies = data
      })
      .catch(error => {
        console.log(error)
      })
    },
    drawDatatable () {
      this.getMovies()
      setTimeout(() => {
        $('#example1').DataTable()
      }, 2000)
    },
    indexWhere (array, id) {
      const item = array.find(item => item.id === id)
      return array.indexOf(item)
    },
    showAddModal () {
      this.modalTitle = 'Thêm phim'
			this.name = ''
			this.poster = ''
			this.trailer = ''
			this.genre = 0
			this.duration = '00:00:00'
    },
    showEditModal (index, id) {
      console.log(index, id)
      this.index = index
      this.idMovie = id
      this.modalTitle = 'Sửa thông tin phim'
			this.name = this.movies[index].name
			this.poster = this.movies[index].poster
			this.trailer = this.movies[index].trailer
			this.genre = this.movies[index].genre
			this.duration = this.movies[index].duration
    },
    showModalPoster (filmName, posterUrl) {
      this.posterUrl = posterUrl
      this.modalTitle = filmName
      this.typeModal = 'poster'
    },
    showModalTrailer (filmName, trailerUrl) {
      this.trailerUrl = trailerUrl.replace('watch?v=', 'embed/')
      this.modalTitle = filmName
      this.typeModal = 'trailer'
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
    deleteConfirm (index, id) {
      console.log(index, id)
      var confirm = window.confirm('Bạn có chắc chắn muốn xóa phim này?')
      if (confirm === true) {
        api.request('delete', '/Movie/' + id)
        .then(response => {
          console.log(response.data)
          this.movies.splice(index, 1)
          $('#example1').DataTable().row($('#' + id)).remove().draw()
          this.showNotify('alert-success', 'Success :)', 'Xóa phim thành công')
        })
        .catch(error => {
          console.log(error)
          this.showNotify('alert-danger', 'Error :\'(', error)
        })
      } else {
        return false
      }
    },
    postMovie () {
      if (this.name !== '' && this.poster !== '' && this.trailer !== '' && this.duration !== '') {
				api.request('post', '/Movie',
					{name: this.name, poster: this.poster, trailer: this.trailer, genre: this.genre, duration: this.duration})
        .then(response => {
          console.log(response.data)
          this.movies.push(response.data)
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Thêm phim thành công')
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
    editMovie () {
      if (this.name !== '' && this.poster !== '' && this.trailer !== '' && this.duration !== '') {
        api.request('put', '/Movie/' + this.idMovie,
            {id: this.idMovie, name: this.name, poster: this.poster, trailer: this.trailer, genre: this.genre, duration: this.duration})
        .then(response => {
          console.log(response.data)
					this.movies[this.index].name = this.name
					this.movies[this.index].poster = this.poster
					this.movies[this.index].trailer = this.trailer
					this.movies[this.index].genre = this.genre
					this.movies[this.index].duration = this.duration
          $('#modal .close').click()
          this.showNotify('alert-success', 'Success :)', 'Sửa thông tin phim thành công')
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
	.poster {
		height: 100px;
		width: 100px;
    cursor: pointer;
	}
  .posterImg {
    width:100%;
    height:100%;
  }
</style>

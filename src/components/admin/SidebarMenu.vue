<template>
  <ul class="sidebar-menu">
    <router-link tag="li" class="pageLink" to="/admin">
      <a>
        <i class="fa fa-desktop"></i>
        <span class="page">Dashboard</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/admin/user">
      <a>
        <i class="fa fa-user"></i>
        <span class="page">Thành viên</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/admin/movie">
      <a>
        <i class="fa fa-film"></i>
        <span class="page">Phim</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/admin/schedule">
      <a>
        <i class="fa fa-calendar-check-o"></i>
        <span class="page">Lịch chiếu</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/admin/ticket">
      <a>
        <i class="fa fa-ticket"></i>
        <span class="page">Vé</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/admin/cinema">
      <a>
        <i class="fa fa-building-o"></i>
        <span class="page">Rạp chiếu</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/admin/room">
      <a>
        <i class="fa fa-book"></i>
        <span class="page">Phòng chiếu</span>
      </a>
    </router-link>
    <!-- <router-link tag="li" class="pageLink" to="/admin/employee">
      <a>
        <i class="fa fa-users"></i>
        <span class="page">Nhân viên</span>
      </a>
    </router-link> -->
    
  </ul>
</template>
<script>
export default {
  name: 'SidebarName'
}
</script>
<style>
  /* override default */
  .sidebar-menu>li>a {
    padding: 12px 15px 12px 15px;
  }

  .sidebar-menu li.active>a>.fa-angle-left, .sidebar-menu li.active>a>.pull-right-container>.fa-angle-left {
    animation-name: rotate;
    animation-duration: .2s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-90deg);
    }
  }
</style>

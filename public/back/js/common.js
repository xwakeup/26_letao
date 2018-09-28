//公共页
// 需求: 在发送第一个ajax的时候, 开启进度条, 在全部的ajax回来的时候, 结束进度条
$(document).ajaxStart(function(){
  NProgress.start();
});
$(document).ajaxStop(function(){
  NProgress.done();
})

//二级菜单切换
$('.lt_aside .category').click(function(){
  $('.lt_aside .child').stop().slideToggle();
})

//左侧菜单栏切换
$('.icon_menu').click(function(){
  $('.lt_aside').toggleClass('hidemenu');
  $('.topbar').toggleClass('hidemenu');
  $('.lt_main').toggleClass('hidemenu');
})

//点击退出按钮,显示模态框
$('.icon_logout').click(function(){
  $('#logoutModal').modal('show');
})

// 点击退出,退出登录,跳转到登录页
$('.logoutBtn').click(function(){
  $.ajax({
    type:"get",
    url:"/employee/employeeLogout",
    dataType:"json",
    success:function(info){
      // console.log(info);
      if(info.success){
        location.href="login.html"
      }
    }
  })
})


$(function(){
  var currentPage=1;//当前页
  var pageSize=5;//每页多少条
  // ajax请求后台数据
  //一进入页面就请求一次数据
   render();
   function render(){
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      dataType:"json",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        var htmlStr=template("tmp",info);
        $('tbody').html(htmlStr);
         // 分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          //总页数
          totalPages:Math.ceil(info.total/info.size),
          // 当前页
          currentPage:info.page,
          // 给分页按钮注册点击事件
          onPageClicked:function(a,b,c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            console.log(page);
            currentPage=page;
            render();
          }
        })
      }
    })
   }

 
})
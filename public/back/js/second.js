$(function(){
  var currentPage=1;
  var pageSize=5;
  //一进入页面就调用一次
  render();
  
  function render(){
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr=template("secondTmp",info);
        $('tbody').html(htmlStr);
        //分页初始化
        $("#paginator").bootstrapPaginator({
          //版本号
          bootstrapMajorVersion:3,
          //总页数
          totalPages:Math.ceil(info.total/info.size),
          //当前页
          currentPage:info.page,
          //给页面注册点击事件
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          }
        })
        
      }
  
    })
  }
})
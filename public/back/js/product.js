$(function(){
  var currentPage=1;
  var pageSize=2;
  // 1/一进入页面,发送请求,进行页面渲染
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr=template("tpl",info);
        $("tbody").html(htmlStr);
        //进行分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//版本，
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          onPageClicked:function(a, b, c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage=page;
            render();
          }
        });
      }
    })
  }
})
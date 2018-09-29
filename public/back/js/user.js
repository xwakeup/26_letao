$(function(){
  var currentPage=1;//当前页
  var pageSize=5;//每页多少条

  var currentId;
  var isDelete;
  // ajax请求后台数据
  //1\一进入页面就请求一次数据
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


   //2\点击启用禁用按钮,显示模态框,通过事件委托绑定事件
   $('tbody').on('click','.btn',function(){
     $('#userModal').modal("show");
     //获取当前数据的id
     currentId=$(this).parent().data("id");
     // 点击禁用按钮,将用户改成禁用状态,isDelete变成0
     isDelete=$(this).hasClass("btn-danger")?0:1;
   })

   //点击模态框的确定按钮,修改用户状态,发送ajax请求
   $('.submitBtn').on("click",function(){
     console.log(currentId,isDelete);
     $.ajax({
       type:"post",
       url:"/user/updateUser",
       data:{
          id:currentId,
          isDelete:isDelete
       },
       dataType:"json",
       success:function(info){
         console.log(info);
         if(info.success){
           //关闭模态框
           $('#userModal').modal("hide");
           //重新渲染
           render();
         }
       }
     })
     
   })

});

 

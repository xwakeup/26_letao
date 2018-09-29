$(function(){
  
  var currentPage=1;
  var pageSize=5;

 //1\一进入页面就发送ajax请求,模板引擎渲染页面
  render();

  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        // 模板引擎渲染
        var htmlStr=template("firstTmp",info);
        $("tbody").html(htmlStr);  
  
        //分页插件初始化
        $("#paginator").bootstrapPaginator({
          //版本号3
          bootstrapMajorVersion:3,
          //总页数
          totalPages:Math.ceil(info.total/info.size),
          //当前页
          currentPage:info.page,
          //页码注册点击事件
          onPageClicked:function(a,b,c,page){
             currentPage=page;
             render();
          }
        })
  
      }
    })
  }

  //2\点击添加分类,显示模态框
  $("#addBtn").on("click",function(){
    $("#addModal").modal("show");
  })

  //3\通过表单校验插件,实现表单校验功能
  $('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',      // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置校验字段
    fields:{
      categoryName:{
         //配置校验规则
         validators:{
           notEmpty:{
             message:"请输入一级分类名称"
           }
         }
      }
    }

  })

  //4\注册表单校验成功事件,阻止reset默认行为,通过ajax提交
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$('#form').serialize(),
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          //关闭模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          currentPage=1;
          render();
          //表单重置
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })
})
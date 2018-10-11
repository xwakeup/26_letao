$(function(){
  var currentPage=1;
  var pageSize=5;
  //1\一进入页面就调用一次
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

  //2\点击添加分类按钮,显示模态框
  $("#addBtn").click(function(){
    $("#addModal").modal("show");
    // 发送ajax请求,请求一级分类的数据
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      dataType:"json",
      success:function(info){
        console.log(info);
      var htmlStr=template("dropdownTpl",info);
      $(".dropdown-menu").html(htmlStr);
        
      }
    })
  })

  //3\给下拉列表中的a添加点击事件(事件委托),获取a的文本,设置给按钮
  $(".dropdown-menu").on("click","a",function(){
    var txt=$(this).text();
    // 设置给按钮
    $("#dropdownTxt").text(txt);
    //获取a中存储的id
    var id=$(this).data("id");
    //设置给name="categoryId"的input框
    $('[name="categoryId"]').val(id);
   //选择了一级分类,需要将一级分类状态更新成成功的
   $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");

  })

  // 4\文件上传初始化
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result);
      //获取图片地址
      var picUrl=data.result.picAddr;
      //设置给img的src
      $("#imgBox img").attr("src",picUrl);
      //设置给name="brandLogo"的input框
      $('[name="brandLogo"]').val(picUrl);
      //选择了图片之后,更新图片上传状态
      $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
});

//5\表单校验
  $("#form").bootstrapValidator({
    excluded: [],
     //配置图标
     feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',      // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置校验字段
    fields:{
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类"
          }
        }
      },
      categoryId:{
        validators:{
          notEmpty:{
            message:"请输入一级分类"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
  })

  //6\注册表单校验成功事件,
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    // 通过ajax提交
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          //关闭模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          currentPage:1;
          render();
          //还要重置表单
          $("#form").data("bootstrapValidator").resetForm(true);
          $("#dropdownTxt").text("请输入一级分类");
          $("#imgBox img").attr("src","./images/none.png");
        }
      }
    })
  })
  


})
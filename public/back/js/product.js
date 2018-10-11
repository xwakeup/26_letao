$(function(){
  var currentPage=1;
  var pageSize=2;
  var picArr=[];
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
          },
          itemTexts:function(type,page,current){
            switch(type){
              case "page":
              return page;
              case "first":
              return "首页";
              case "last":
              return "尾页";
              case "next":
              return "下一页";
              case "prev":
              return "上一页";
            }
            },
          tooltipTitles:function(type,page,current){
            switch(type){
              case "page":
              return "前往第"+page+"页";
              case "first":
              return "首页";
              case "last":
              return "尾页";
              case "next":
              return "下一页";
              case "prev":
              return "上一页";
            }
            
          },
          //使用bootstrap的提示框组件
          useBootstrapTooltip:true,
        });
      }
    })
  }

  //2\点击添加商品,显示模态框
  $("#addBtn").click(function(){
    //显示模态框
    $("#addModal").modal("show");
    //发送ajax请求,渲染下拉菜单的二级分类
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr=template("dropTpl",info);
        $(".dropdown-menu").html(htmlStr);
        
      }
    })
  })

  //3\给下拉列表中的a用事件委托绑定注册点击事件
  $(".dropdown-menu").on("click","a",function(){
    //获取文本,设置给按钮
      var txt =$(this).text();
      $("#dropdownTxt").text(txt);
      //获取id,赋值给隐藏域
      var id =$(this).data("id");
      $('[name="brandId"]').val(id);
      //手动更新name="brandId"的input框的校验状态为VALID
      $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");

  })

  //4\文件上传初始化
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){
      console.log(data.result);
      
      var picUrl=data.result.picAddr;
      //将图片对象存储在数组最前面
      picArr.unshift(data.result);
      $("#imgBox").prepend('<img src="'+ picUrl +'" width="100" height="100" alt="">');
      //如果图片数量大于3,需要移除最后一张(移除dom结构中和数组中)
      if(picArr.length>3){
        $('#imgBox img:last-of-type').remove();
        picArr.pop();
      }
      //如果数组长度等于3,说明上传了3张图片,
      //要更新表单校验状态,picStatus为VALID
      if(picArr.length===3){
        $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
      }
    }
  })

  //5表单校验
  $("#form").bootstrapValidator({
    // 对隐藏域也校验
    excluded: [],
    // 指定校验时显示的图标, 固定写法
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',      // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields:{
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 请求库存必须是, 非0开头的数字
      num:{
        validators:{
          notEmpty:{
            message:"请输入商品库存"
          },
          // 正则校验
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:"商品库存必须是非零开头的数字"
          }
        }
      },
      // 要求尺码非空, 要求尺码格式 xx-xx,  x为数字
      size:{
        validators:{
          notEmpty:{
            message:"请输入尺码"
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"要求尺码为 xx-xx 的格式, 例如 32-40"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },

      // 用于标记当前图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      }
    }
  
  })

  //6注册表单校验成功事件
  $("#form").on("success.form.bv",function(e){
     e.preventDefault();
     console.log(picArr);
     
     var paramsStr=$("#form").serialize();
     paramsStr+="&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr; 
     paramsStr+="&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr; 
     paramsStr+="&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr; 

     $.ajax({
       type:"post",
       url:"/product/addProduct",
       data:paramsStr,
       dataType:"json",
       success:function(info){
         console.log(info);
         if(info.success){
           //关闭模态框
           $("#addModal").modal("hide");
           //页面重新渲染
           currentPage=1;
           render();
           //重置表单数据
           $("#form").data("bootstrapValidator").resetForm(true);
           //手动重置,下拉框按钮和图片
           $("#dropdownTxt").text("请选择二级分类");
           $("#imgBox img").remove();
           picArr=[]//同步清空数组
         }
       }
     })
  })



  })
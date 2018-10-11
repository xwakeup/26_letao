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

  })

  //4\文件上传初始化
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){
      console.log(data.result);
      
      var picUrl=data.result.picAddr;
      //将图片对象存储在数组最前面
      picArr.unshift(data.reesult);
      $("#imgBox").prepend('<img src="'+ picUrl +'" width="100" height="100" alt="">');
      //如果图片数量大于3,需要移除最后一张(移除dom结构中和数组中)
      if(picArr.length>3){
        $('#imgBox img:last-of-type').remove();
        picArr.pop();
      }
    }
  })
})
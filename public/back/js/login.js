$(function(){
    /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  $('#form').bootstrapValidator({
    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置校验字段
    fields:{
      username:{
        validators:{
          notEmpty:{
            message:"用户名不能为空"
          },
          stringLength:{
            min:2,
            max:6,
            message:"用户名长度必须是2-6位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:"密码不能为空"
          },
          stringLength:{
            min:6,
            max:12,
            message:"密码长度必须为6-12位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
  })

  //注册表单校验成功事件
  $('#form').on("success.form.bv",function(e){
    //阻止默认事件
    e.preventDefault();
   //用ajax提交
   $.ajax({
     type:"post",
     url:"/employee/employeeLogin",
     data:$('#form').serialize(),
     dataType:"json",
     success:function(info){
      //  console.log(info);
      if(info.success){
        //登录成功,跳转到首页
        location.href="index.html";
      }
      if(info.error===1000){
        $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
      }
      if(info.error===1001){
        $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
      }
       
     }
   })
  })

     //3添加重置功能
   $('[type="reset"]').on('click',function(){
      $('#form').data('bootstrapValidator').resetForm();
   })
  // $('[type="reset"]').click(function(){
  //   $('#form').data('bootstrapValidator').resetForm();
  // })
})
var loginin = new Vue({
  el:'#login-div',
  data:{
    message: '',
    isload: false
  },
  methods:{
    login_in: function () {
      var login = $('#login').val();//encodeURIComponent($('#login').val());
      var password = $('#password').val();//encodeURIComponent($('#password').val());
      var regexp = /^[A-Za-z0-9_-]{6,20}$/;
      if (regexp.test(login) && regexp.test(password)) {
        /*var xhr = new XMLHttpRequest();
        xhr.open = ('POST', '/user/login', true); //Тут нужно указать правильный путь
        xhr.timeout = 30000;*/
        /*var Data = {
          "username": login,
          "password": password
        };*/
        $.ajax({
          url:'api/user/login',
          type:'POST',
          data: {'username': login, 'password': password},
          beforeSend: function (data) {
            loginin.isload = true;
          },
          /*dataType: "json",
          jsonp: false,*/
          timeout: 30000,
          error: function (data) {
            loginin.isload = false;
            loginin.message = 'Ошибка';
          },
          statusCode:{
            400: function () {
              loginin.isload = false;
              loginin.message = 'Вход уже выполнен';
            },
            500: function () {
              loginin.isload = false;
              loginin.message = 'Ошибка входа';
            }
          },
          success:function (res) {

            var errors = "";
            if (res.errors) {
              for (var i = 0; i < res.errors.length; i++) {
                errors = errors + "\n" + res.errors[i]
              }
              loginin.isload = false;
            }
            if (res.data) {
              $.ajax({
                url: 'api/test/setup',
                type: 'POST',
                error: function (data) {
                  loginin.message = 'Ошибка';
                  loginin.isload = false;
                },
                success: function (res) {
                  location.replace("/");
                  loginin.isload = false;
                }
              });
            }
            loginin.message = errors;
            //location.replace("/");
          }
        });
      }
      else {
        this.message = 'Логин и/или пароль введены не правильно';
      }



    }
  }
});

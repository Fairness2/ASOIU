var loginin = new Vue({
  el:'#login-div',
  data:{
    message: '',
    isload: false
  },
  methods:{
    login_in: function () {
      var login = encodeURIComponent($('#login').val());
      var password = encodeURIComponent($('#password').val());
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
          beforSend: function (jqXHR) {
            this.isload = true;
          },
          dataType: "json",
          jsonp: false,
          timeout: 30000,
          error: function (jqXHR, textStatus, errorThrown) {
            this.isload = true;
            this.message = errorThrown;
          },
          statusCode:{
            400: function () {
              this.isload = true;
              this.message = 'Вход уже выполнен';
            }
          },
          success:function (res) {
            this.isload = false;
            this.message = res;
          }
        });
      }
      else {
        this.message = 'Логин и/или пароль введены не правильно';
      }



    }
  }
});

//боковое меню
var side_nav = new Vue({
  el: '#slide-out',
  data:{
    name: '',
    department: ''
  },
  methods:{
    onredys: function () {
      //тут должена быть загрузка из сессии авторизованого пользователя
      this.name= 'Оржик Николай Григорьевич';
      this.department = 'Реклама и Маркетинг';
    }
  }
});

var menu_section = new Vue ({
  el: '#menu_section',
  methods: {
    show_section: function (secton) {
      if (secton == 1) {
        users_section.onloading();
        users_section.show = true;
        user.show = false;
      }else if (secton == 2) {
        users_section.show = false;
        user.show = false;
      }else if (secton == 3) {
        users_section.show = false;
        user.show = false;
      }
    }
  }
});

var users_section = new Vue({
  el: '#users_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    if_message: false,
    add_load: false,
    message_error: '',
    message: 'Опачки',

    users: [
      {id:'10', name:'Вася', login:'Vasek228', department:'грузоперевозки', num:'25'},
      {id:'11', name:'Аделаида', login:'Adya_Sexy', department:'Клиринг', num:'26'}
    ]
  },
  methods: {
    user_check: function (id) {
      user.new_user = false;
      user.id = id;
      user.onloading(id);
      user.show = true;
    },

    new_user: function () {
      user.new_user = true;
      user.change_passwd = true;
      user.onloading_new();
      user.show = true;
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список пользователей*/
        url:'api/user?after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          users_section.isload = false;
          users_section.loaderror = true;
          users_section.loadtrue = true; //не забыть поменять
          users_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          users_section.isload = false;
          users_section.loaderror = false;
          users_section.loadtrue = true; //не забыть поменять
        }
      });
    },

    add_users: function () {
      this.add_load = true;
      this.if_message = false;
      var num = this.users[this.users.length - 1].num;
      $.ajax({
        /*список пользователей*/
        url:'api/user?after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          users_section.add_load = false;
          users_section.if_message = true;
          users_section.message = 'Загрузить не получилось';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          users_section.add_load = false;
        }
      });
    }
  }
});

var user = new Vue({
  el: '#user',
  data: {
    show: false,
    isload: false,
    loaderror: false,
    loadtrue:false,
    new_user: false,
    change_passwd: false,
    error_dep: false,
    login: '',
    passwd: '',
    again_passwd: '',
    id: '',
    message_dep: '',
    message_error: '',
    message_failure: '',
    message_success: '',
    isload_too: 0,
    departments: [
      {id:'5ad2349d-af4c-4736-8659-1c73852d999b', name: 'Реклама и Маркетиг', table_show: false,
      employees:[
        {id:'c6cbdb81-8efc-4d52-adb1-81ac87b72e68', check: false, name: 'Оржик Генадий Васильевич'},
        {id:'60d82ea4-9760-4248-9761-8a3fe87b11f6', check: false, name: 'Ыхтанг Ырнаст Ылаевич'}
      ]},
      {id:'63feeeed-bb04-4ab1-998e-f7852890cb95', name: 'Клиринг', table_show: false,
      employees:[
        {id:'1f6fc2a2-14b1-4d89-a7d2-f3e303eb8af7', check: false, name: 'Андревасян Андрей Васильевич'},
        {id:'552e31f2-9589-4e04-98da-327319802d37', check: false, name: 'Ввмав Авиыбиьке Виьлкеиь'}
      ]}
    ]
  },
  methods: {
    onloading_new: function () {
      this.isload = true;
      this.message_failure = '';
      this.message_success = '';
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/department?with=employee',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          user.isload = false;
          user.loaderror = true;
          user.loadtrue = true;//не забыть изменить
          user.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          user.isload = false;
          user.loaderror = false;
          user.loadtrue = true;
        }
      });
    },

    onloading: function (id) {
      this.isload = true;
      this.isload_too = 0;
      this.message_failure = '';
      this.message_success = '';
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/department?with=employee',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          user.isload_too = -1;
          user.isload = false;
          user.loaderror = true;
          user.loadtrue = true;//не забыть изменить
          user.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          if (user.isload_too == 2) {
            user.isload = false;
            user.loaderror = false;
            user.loadtrue = true;
            //не забыть отметить сотрудника
          }else {
            user.isload_too++;

          }
        }
      });
      $.ajax({
        /*информация о пользоваателе*/
        url:'api/user/info/' + id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          user.isload_too = -1;
          user.isload = false;
          user.loaderror = true;
          user.loadtrue = true;//не забыть изменить
          user.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          if (user.isload_too == 2) {
            user.isload = false;
            user.loaderror = false;
            user.loadtrue = true;
            alert(res);
          }else {
            user.isload_too++;
            alert(res);
          }
        }
      });
    },

    show_department: function (id) {
      for (var i = 0; i < this.departments.length; i++)
      {
        if(this.departments[i].id == id)
        {
          this.departments[i].table_show = true;
        }else {
          this.departments[i].table_show = false;
        }
      }
    },

    create_user: function () {
      var regexp = /^[A-Za-z0-9_-]{6,20}$/;
      var flag = false;
      if (this.passwd == this.again_passwd) {
        flag = true;
      }
      var employee = '';
      for (var i = 0; i < this.departments.length; i++) {
        if (this.departments[i].table_show) {
          for (var j = 0; i < this.departments[i].employees.length; j++) {
            if (this.departments[i].employees[j].check) {
              employee = this.departments[i].employees[j].id;
              break;
            }
          }
          break;
        }
      }
      if (regexp.test(this.login) && regexp.test(this.passwd) && flag && employee != '') {
        $.ajax({
          /*Регистрация*/
          url:'api/user/register',
          type:'POST',
          data: {'username': login, 'password': passwd, 'employeeId': employee},
          timeout: 30000,
          error: function (data) {
            user.message_failure = 'Создать пользователя не удалось';
            user.message_success = '';
          },
          success:function (res) {
            user.message_failure = '';
            user.message_success = 'Пользоваетель успешно создан';
          }
        });
      }else {
        user.message_failure = 'Заполните поля правильно';
        user.message_success = '';
      }
    },

    change_user: function () {
      var regexp = /^[A-Za-z0-9_-]{6,20}$/;
      var flag = false;
      if (this.change_passwd) {
        if (this.passwd == this.again_passwd && regexp.test(this.passwd)) {
          flag = true;
        }
      }else {
        flag = true;
        this.passwd = '';
      }

      var employee = '';
      for (var i = 0; i < this.departments.length; i++) {
        if (this.departments[i].table_show) {
          for (var j = 0; i < this.departments[i].employees.length; j++) {
            if (this.departments[i].employees[j].check) {
              employee = this.departments[i].employees[j].id;
              break;
            }
          }
          break;
        }
      }
      if (regexp.test(this.login)  && flag && employee != '') {
        $.ajax({
          /*Регистрация*/
          url:'api/user/update',
          type:'POST',
          data: {'username': login, 'password': passwd, 'employeeId': employee, 'id': user.id},
          timeout: 30000,
          error: function (data) {
            user.message_failure = 'Изменить пользователя не удалось';
            user.message_success = '';
          },
          success:function (res) {
            user.message_failure = '';
            user.message_success = 'Пользоваетель успешно изменён';
          }
        });
      }else {
        user.message_failure = 'Заполните поля правильно';
        user.message_success = '';
      }
    },

    del_user: function () {
      $.ajax({
        /*Регистрация*/
        url:'api/user',
        type:'DELETE',
        data: {'id': user.id},
        timeout: 30000,
        error: function (data) {
          user.message_failure = 'Удалить пользователя не удалось';
          user.message_success = '';
        },
        success:function (res) {
          user.message_failure = '';
          user.message_success = 'Пользоваетель успешно удалён';
        }
      });
    }
  }
});
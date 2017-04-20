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
        employees_section.onloading();
        employees_section.show = true;
        employee.show = false;
        article_section.show = false;
        article.show = false;
        products_section.show = false;
        departments_section.show = false;
        cfos_section.show = false;
      }else if (secton == 2) {
        users_section.show = false;
        user.show = false;
        employees_section.show = false;
        employee.show = false;
        article_section.onloading();
        article_section.show = true;
        article.show = false;
        products_section.show = false;
        departments_section.show = false;
        cfos_section.show = false;
      }else if (secton == 3) {
        users_section.show = false;
        user.show = false;
        employees_section.show = false;
        employee.show = false;
        article_section.show = false;
        article.show = false;
        products_section.show = false;
        departments_section.show = true;
        departments_section.onloading();
        cfos_section.show = true;
        cfos_section.onloading();
      }else if (secton == 4) {
        users_section.show = false;
        user.show = false;
        employees_section.show = false;
        employee.show = false;
        article_section.show = false;
        article.show = false;
        products_section.show = false;
        departments_section.show = false;
        cfos_section.show = false;
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
      this.id = id;
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
      if (this.id != '') {
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
      }else {
        user.message_failure = 'Что-то пошло не так';
        user.message_success = '';
      }
    }
  }
});

var employees_section = new Vue({
  el: '#employees_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    if_message: false,
    add_load: false,
    message_error: '',
    message: 'Опачки',

    employees: [
      {id:'10', name:'Вася', department:'грузоперевозки', num:'25'},
      {id:'11', name:'Аделаида', department:'Клиринг', num:'26'}
    ]
  },
  methods: {
    employee_check: function (id) {
      employee.new_employee = false;
      employee.id = id;
      employee.onloading(id);
      employee.show = true;
    },

    new_employee: function () {
      employee.new_employee = true;
      employee.onloading_new();
      employee.show = true;
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список пользователей*/
        url:'api/employee?after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employees_section.isload = false;
          employees_section.loaderror = true;
          employees_section.loadtrue = true; //не забыть поменять
          employees_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          employees_section.isload = false;
          employees_section.loaderror = false;
          employees_section.loadtrue = true; //не забыть поменять
        }
      });
    },

    add_employee: function () {
      this.add_load = true;
      this.if_message = false;
      var num = this.employees[this.employees.length - 1].num;
      $.ajax({
        /*список пользователей*/
        url:'api/employee?after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employees_section.add_load = false;
          employees_section.if_message = true;
          employees_section.message = 'Загрузить не получилось';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          employees_section.add_load = false;
        }
      });
    }
  }
});

var employee = new Vue({
  el: '#employee',
  data: {
    show: false,
    isload: false,
    loaderror: false,
    loadtrue:false,
    new_employee: false,
    error_dep: false,
    FIO: '',
    id: '',
    message_dep: '',
    message_error: '',
    message_failure: '',
    message_success: '',
    birthday: '',
    sex: false,
    isload_too: 0,
    departments: [
      {id:'5ad2349d-af4c-4736-8659-1c73852d999b', name: 'Реклама и Маркетиг', check: false},
      {id:'63feeeed-bb04-4ab1-998e-f7852890cb95', name: 'Клиринг', check: false}
    ]
  },
  methods: {
    onloading_new: function () {
      this.isload = true;
      this.message_failure = '';
      this.message_success = '';
      $('.datepicker').pickadate({
       selectMonths: true, // Creates a dropdown to control month
       selectYears: 15 // Creates a dropdown of 15 years to control year
      });
      $.ajax({
        /*список список отделов*/
        url:'api/department',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employee.isload = false;
          employee.loaderror = true;
          employee.loadtrue = true;//не забыть изменить
          employee.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          employee.isload = false;
          employee.loaderror = false;
          employee.loadtrue = true;

        }
      });
    },

    onloading: function (id) {
      this.isload = true;
      this.id = id;
      this.isload_too = 0;
      this.message_failure = '';
      this.message_success = '';
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/department',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employee.isload_too = -1;
          employee.isload = false;
          employee.loaderror = true;
          employee.loadtrue = true;//не забыть изменить
          employee.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          if (employee.isload_too == 2) {
            employee.isload = false;
            employee.loaderror = false;
            employee.loadtrue = true;

          }else {
            employee.isload_too++;

          }
        }
      });
      $.ajax({
        /*информация о сотруднике*/
        url:'api/employee?id=' + id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employee.isload_too = -1;
          employee.isload = false;
          employee.loaderror = true;
          employee.loadtrue = true;//не забыть изменить
          employee.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать сотрудника
          if (employee.isload_too == 2) {
            employee.isload = false;
            employee.loaderror = false;
            employee.loadtrue = true;
            alert(res);
          }else {
            employee.isload_too++;
            alert(res);
          }
        }
      });
    },

    create_employee: function () {
      var regexp = /^[А-Яа-я-\s]{2,50}$/;
      var sex = false;
      if ($("#sex1").prop("checked")){
        sex = true;
      }
      var department = '';
      for (var i = 0; i < this.departments.length; i++) {
        if (this.departments[i].check) {
          department = this.departments[i].id;
          break;
        }
      }
      if (regexp.test(this.FIO) && this.birthday != '' && department != '') {
        $.ajax({
          /*Добавление сотрудника*/
          url:'api/employee/create',
          type:'POST',
          data: {'fullName': employee.FIO, 'sex': sex, 'birthDate': employee.birthday, 'department': department},
          timeout: 30000,
          error: function (data) {
            employee.message_failure = 'Создать сотрудника не удалось';
            employee.message_success = '';
          },
          success:function (res) {
            employee.message_failure = '';
            employee.message_success = 'Сотрудник успешно создан';
          }
        });
      }else {
        employee.message_failure = 'Заполните поля правильно';
        employee.message_success = '';
      }
    },

    change_employee: function () {
      var regexp = /^[А-Яа-я-\s]{2,50}$/;
      var sex = false;
      if ($("#sex1").prop("checked")){
        sex = true;
      }
      var department = '';
      for (var i = 0; i < this.departments.length; i++) {
        if (this.departments[i].check) {
          department = this.departments[i].id;
          break;
        }
      }
      if (regexp.test(this.FIO) && this.birthday != '' && department != '' && id != '') {
        $.ajax({
          /*Добавление сотрудника*/
          url:'api/employee/update',
          type:'POST',
          data: {'fullName': employee.FIO, 'sex': sex, 'birthDate': employee.birthday, 'id': employee.id, 'department': department},
          timeout: 30000,
          error: function (data) {
            employee.message_failure = 'Создать изменить не удалось';
            employee.message_success = '';
          },
          success:function (res) {
            employee.message_failure = '';
            employee.message_success = 'Сотрудник успешно изменён';
          }
        });
      }else {
        employee.message_failure = 'Заполните поля правильно';
        employee.message_success = '';
      }
    },

    del_employee: function () {
      if (this.id != '') {
        $.ajax({
          /*Удаление*/
          url:'api/employee',
          type:'DELETE',
          data: {'id': employee.id},
          timeout: 30000,
          error: function (data) {
            employee.message_failure = 'Удалить сотрудника не удалось';
            employee.message_success = '';
          },
          success:function (res) {
            employee.message_failure = '';
            employee.message_success = 'Сотрудник успешно удалён';
          }
        });
      }else {
        employee.message_failure = 'Что-то пошло не так';
        employee.message_success = '';
      }

    }
  }
});

var article_section = new Vue({
  el: '#article_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    if_message: false,
    add_load: false,
    message_error: '',
    message: 'Опачки',

    articles: [
      {id:'10', name:'Мы команда', cfo:'Наша банда', num:'25'},
      {id:'11', name:'Жопа', cfo:'ЖОпа', num:'2'}
    ]
  },
  methods: {
    article_check: function (id) {
      article.new_article = false;
      article.id = id;
      article.onloading(id);
      article.show = true;
    },

    new_article: function () {
      article.new_article = true;
      article.onloading_new();
      article.show = true;
    },

    view_item: function (id, name) {
      products_section.article_id = id;
      products_section.article_name = name;
      products_section.onloading(id);
      products_section.show = true;
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список статей*/
        url:'api/cost-item?after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          article_section.isload = false;
          article_section.loaderror = true;
          article_section.loadtrue = true; //не забыть поменять
          article_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать статьи
          article_section.isload = false;
          article_section.loaderror = false;
          article_section.loadtrue = true;

        }
      });
    },

    add_article: function () {
      this.add_load = true;
      this.if_message = false;
      var num = this.articles[this.articles.length - 1].num;
      $.ajax({
        /*список пользователей*/
        url:'api/cost-item?after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          article_section.add_load = false;
          article_section.if_message = true;
          article_section.message = 'Загрузить не получилось';
        },
        success:function (res) {
          //Тут нужно обработать статьи
          article_section.add_load = false;
        }
      });
    }
  }
});

var article = new Vue({
  el: '#article',
  data: {
    show: false,
    isload: false,
    loaderror: false,
    loadtrue:false,
    new_article: false,
    error_dep: false,
    name: '',
    id: '',
    message_dep: '',
    message_error: '',
    message_failure: '',
    message_success: '',
    isload_too: 0,
    cfos: [
      {id:'5ad2349d-af4c-4736-8659-1c73852d999b', name: 'Реклама и Маркетиг', check: false},
      {id:'63feeeed-bb04-4ab1-998e-f7852890cb95', name: 'Клиринг', check: false}
    ]
  },
  methods: {
    onloading_new: function () {
      this.isload = true;
      this.message_failure = '';
      this.message_success = '';
      $.ajax({
        /*список список отделов*/
        url:'api/frc',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          article.isload = false;
          article.loaderror = true;
          article.loadtrue = true;//не забыть изменить
          article.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          article.isload = false;
          article.loaderror = false;
          article.loadtrue = true;

        }
      });
    },

    onloading: function (id) {
      this.isload = true;
      this.id = id;
      this.isload_too = 0;
      this.message_failure = '';
      this.message_success = '';
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/frc',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          article.isload_too = -1;
          article.isload = false;
          article.loaderror = true;
          article.loadtrue = true;//не забыть изменить
          article.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          if (article.isload_too == 2) {
            article.isload = false;
            article.loaderror = false;
            article.loadtrue = true;

          }else {
            article.isload_too++;

          }
        }
      });
      $.ajax({
        /*информация о сотруднике*/
        url:'api/cost-item?id=' + id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          article.isload_too = -1;
          article.isload = false;
          article.loaderror = true;
          article.loadtrue = true;//не забыть изменить
          article.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать сотрудника
          if (article.isload_too == 2) {
            article.isload = false;
            article.loaderror = false;
            article.loadtrue = true;
            alert(res);
          }else {
            article.isload_too++;
            alert(res);
          }
        }
      });
    },

    create_article: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,60}$/i;
      var cfo = '';
      for (var i = 0; i < this.cfos.length; i++) {
        if (this.cfos[i].check) {
          cfo = this.cfos[i].id;
          break;
        }
      }
      if (regexp.test(this.name) && cfo != '') {
        $.ajax({
          /*Добавление статьи*/
          url:'api/cast-item/create',
          type:'POST',
          data: {'name': article.name, 'frc': cfo},
          timeout: 30000,
          error: function (data) {
            article.message_failure = 'Создать статью не удалось';
            article.message_success = '';
          },
          success:function (res) {
            article.message_failure = '';
            article.message_success = 'Статья успешно создана';
          }
        });
      }else {
        article.message_failure = 'Заполните поля правильно';
        article.message_success = '';
      }
    },

    change_article: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,60}$/i;
      var cfo = '';
      for (var i = 0; i < this.cfos.length; i++) {
        if (this.cfos[i].check) {
          cfo = this.cfos[i].id;
          break;
        }
      }
      if (regexp.test(this.name) && cfo != ''&& id != '') {
        $.ajax({
          /*изменение  стстьи*/
          url:'api/cast-item/update',
          type:'POST',
          data: {'name': article.name, 'frc': cfo, 'id': article.name.id},
          timeout: 30000,
          error: function (data) {
            article.message_failure = 'Изменить статью не удалось';
            article.message_success = '';
          },
          success:function (res) {
            article.message_failure = '';
            article.message_success = 'Статья успешно изменена';
          }
        });
      }else {
        article.message_failure = 'Заполните поля правильно';
        article.message_success = '';
      }
    },

    del_article: function () {
      if (this.id != '') {
        $.ajax({
          /*Удаление*/
          url:'api/cost-item',
          type:'DELETE',
          data: {'id': article.id},
          timeout: 30000,
          error: function (data) {
            article.message_failure = 'Удалить статью не удалось';
            article.message_success = '';
          },
          success:function (res) {
            article.message_failure = '';
            article.message_success = 'Статья успешно удалёна';

          }
        });
      }else {
        article.message_failure = 'Что-то пошло не так';
        article.message_success = '';
      }

    }
  }
});

var products_section = new Vue({
  el: '#products_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    message_error: '',
    article_name: '',
    article_id: '',
    products: [
      {id:'10', name:'Диван', price:'30000'},
      {id:'101', name:'Кресло', price:'4363'},
      {id:'102', name:'Стол', price:'2344'}
    ]
  },
  methods: {
    product_check: function (id, name, price) {
      product.new_product = false;
      product.article_id = this.article_id;
      product.article_name = this.article_name;
      product.id = id;
      product.name = name;
      product.price = price;
      $('#product').modal('open');
    },

    new_product: function () {
      product.new_product = true;
      product.article_id = this.article_id;
      product.article_name = this.article_name;
      product.id = '';
      product.name = '';
      product.price = '';
      $('#product').modal('open');
    },

    del_product: function (id, name) {
      product_del.id = id;
      product_del.name = name;
      $('#product_del').modal('open');
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список статей*/
        url:'api/product?cost-item=' + products_section.id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          products_section.isload = false;
          products_section.loaderror = true;
          products_section.loadtrue = true; //не забыть поменять
          products_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать товарные позиции
          products_section.isload = false;
          products_section.loaderror = false;
          products_section.loadtrue = true;

        }
      });
    }
  }
});

var product = new Vue({
  el: '#product',
  data: {
    new_product: true,
    article_name: '',
    article_id: '',
    name: '',
    price: '',
    id: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    create_product: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,50}$/i;

      if (regexp.test(this.name) && this.price >= 0) {
        $.ajax({
          /*Добавление товара*/
          url:'api/product/create',
          type:'POST',
          data: {'name': product.name, 'price': product.price, 'costItemId': product.article_id},
          timeout: 30000,
          error: function (data) {
            product.message_failure = 'Добавить товар не удалось';
            product.message_success = '';
          },
          success:function (res) {
            product.message_failure = '';
            product.message_success = 'Товар успешно добавлен';
          }
        });
      }else {
        product.message_failure = 'Заполните поля правильно';
        product.message_success = '';
      }
    },

    update_product: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,50}$/i;

      if (regexp.test(this.name) && this.price >= 0 && this.id != '') {
        $.ajax({
          /*Изменение товара*/
          url:'api/product/update',
          type:'POST',
          data: {'name': product.name, 'price': product.price, 'id': product.id, 'costItemId': product.article_id},
          timeout: 30000,
          error: function (data) {
            product.message_failure = 'Изменить товар не удалось';
            product.message_success = '';
          },
          success:function (res) {
            product.message_failure = '';
            product.message_success = 'Товар успешно изменён';
          }
        });
      }else {
        product.message_failure = 'Заполните поля правильно';
        product.message_success = '';
      }
    }
  }
});

var product_del = new Vue({
  el: '#product_del',
  data: {
    id: '',
    name: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    del_product: function () {
      if (this.id != '') {
        $.ajax({
          /*Добавление статьи*/
          url:'api/product',
          type:'DELETE',
          data: {'id': product_del.id},
          timeout: 30000,
          error: function (data) {
            product_del.message_failure = 'Удалить товар не удалось';
            product_del.message_success = '';
          },
          success:function (res) {
            product_del.message_failure = '';
            product_del.message_success = 'Товар успешно удалён';
          }
        });
      }else {
        product_del.message_failure = 'Опс';
        product_del.message_success = '';
      }
    }
  }
});

var departments_section = new Vue({
  el: '#departments_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    message_error: '',
    departments: [
      {id:'10', fullname:'Дидидидави', shortname:'Д'},
      {id:'101', fullname:'Авиваи', shortname:'А'},
      {id:'102', fullname:'Блед', shortname:'Б'},
    ]
  },
  methods: {
    department_check: function (id, fullname, shortname) {
      department.new_product = false;
      department.id = id;
      department.fullname = fullname;
      department.shortname = shortname;
      $('#department').modal('open');
      $('#department_fullname').trigger('autoresize');
    },

    new_department: function () {
      department.new_product = true;
      department.id = '';
      department.fullname = '';
      department.shortname = '';
      $('#department').modal('open');
      $('#department_fullname').trigger('autoresize');
    },

    del_department: function (id, fullname) {
      department_del.id = id;
      department_del.fullname = fullname;
      $('#department_del').modal('open');
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список отделов*/
        url:'api/department',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          departments_section.isload = false;
          departments_section.loaderror = true;
          departments_section.loadtrue = true; //не забыть поменять
          departments_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          departments_section.isload = false;
          departments_section.loaderror = false;
          departments_section.loadtrue = true;

        }
      });
    }
  }
});

var department = new Vue({
  el: '#department',
  data: {
    new_product: true,
    fullname: '',
    shortname: '',
    id: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    create_department: function () {
      var regexpfull = /^[а-яё/w/d\- ]{1,200}$/i;
      var regexpshort = /^[а-яё/w/d\- ]{1,50}$/i;

      if (regexpfull.test(this.fullname) && regexpshort.test(this.shortname)) {
        $.ajax({
          /*Добавление отдела*/
          url:'api/department/create',
          type:'POST',
          data: {'fullname': department.fullname, 'shortname': department.shortname},
          timeout: 30000,
          error: function (data) {
            product.message_failure = 'Добавить отдел не удалось';
            product.message_success = '';
          },
          success:function (res) {
            product.message_failure = '';
            product.message_success = 'Отдел успешно добавлен';
          }
        });
      }else {
        product.message_failure = 'Заполните поля правильно';
        product.message_success = '';
      }
    },

    update_department: function () {
      var regexpfull = /^[а-яё/w/d\- ]{1,200}$/i;
      var regexpshort = /^[а-яё/w/d\- ]{1,50}$/i;

      if (regexpfull.test(this.fullname) && regexpshort.test(this.shortname) && this.id != '') {
        $.ajax({
          /*Изменение отдела*/
          url:'api/department/update',
          type:'POST',
          data: {'fullname': department.fullname, 'shortname': department.shortname, 'id': product.id},
          timeout: 30000,
          error: function (data) {
            product.message_failure = 'Изменить отдел не удалось';
            product.message_success = '';
          },
          success:function (res) {
            product.message_failure = '';
            product.message_success = 'Отдел успешно изменён';
          }
        });
      }else {
        product.message_failure = 'Заполните поля правильно';
        product.message_success = '';
      }
    }
  }
});

var department_del = new Vue({
  el: '#department_del',
  data: {
    id: '',
    fullname: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    del_department: function () {
      if (this.id != '') {
        $.ajax({
          /*Удаление отдела*/
          url:'api/department',
          type:'DELETE',
          data: {'id': department_del.id},
          timeout: 30000,
          error: function (data) {
            department_del.message_failure = 'Удалить отдел не удалось';
            department_del.message_success = '';
          },
          success:function (res) {
            department_del.message_failure = '';
            department_del.message_success = 'Отдел успешно удалён';
          }
        });
      }else {
        department_del.message_failure = 'Опс';
        department_del.message_success = '';
      }
    }
  }
});

var cfos_section = new Vue({
  el: '#cfos_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    message_error: '',
    cfos: [
      {id:'10', name:'Дидидидави'},
      {id:'101', name:'Авиваи'},
      {id:'102', name:'Блед'},
    ]
  },
  methods: {
    cfo_check: function (id, name) {
      cfo.new_product = false;
      cfo.id = id;
      cfo.name = name;
      $('#cfo').modal('open');
      $('#cfo_name').trigger('autoresize');
    },

    new_cfo: function () {
      cfo.new_product = true;
      cfo.id = '';
      cfo.name = '';
      $('#cfo').modal('open');
      $('#cfo_name').trigger('autoresize');
    },

    del_cfo: function (id, name) {
      cfo_del.id = id;
      cfo_del.name = name;
      $('#cfo_del').modal('open');
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список отделов*/
        url:'api/frc',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          cfos_section.isload = false;
          cfos_section.loaderror = true;
          cfos_section.loadtrue = true; //не забыть поменять
          cfos_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          cfos_section.isload = false;
          cfos_section.loaderror = false;
          cfos_section.loadtrue = true;

        }
      });
    }
  }
});

var cfo = new Vue({
  el: '#cfo',
  data: {
    new_product: true,
    name: '',
    id: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    create_cfo: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,100}$/i;

      if (regexp.test(this.name)) {
        $.ajax({
          /*Добавление цфо*/
          url:'api/frc/create',
          type:'POST',
          data: {'name': cfo.name},
          timeout: 30000,
          error: function (data) {
            cfo.message_failure = 'Добавить ЦФО не удалось';
            cfo.message_success = '';
          },
          success:function (res) {
            cfo.message_failure = '';
            cfo.message_success = 'ЦФО успешно добавлен';
          }
        });
      }else {
        cfo.message_failure = 'Заполните поля правильно';
        cfo.message_success = '';
      }
    },

    update_cfo: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,100}$/i;

      if (regexp.test(this.name) && this.id != '') {
        $.ajax({
          /*Изменение ЦФО*/
          url:'api/frc/update',
          type:'POST',
          data: {'name': cfo.name, 'id': cfo.id},
          timeout: 30000,
          error: function (data) {
            cfo.message_failure = 'Изменить ЦФО не удалось';
            cfo.message_success = '';
          },
          success:function (res) {
            cfo.message_failure = '';
            cfo.message_success = 'ЦФО успешно изменён';
          }
        });
      }else {
        cfo.message_failure = 'Заполните поля правильно';
        cfo.message_success = '';
      }
    }
  }
});

var cfo_del = new Vue({
  el: '#cfo_del',
  data: {
    id: '',
    name: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    del_cfo: function () {
      if (this.id != '') {
        $.ajax({
          /*Удаление отдела*/
          url:'api/frc',
          type:'DELETE',
          data: {'id': cfo_del.id},
          timeout: 30000,
          error: function (data) {
            cfo_del.message_failure = 'Удалить ЦФО не удалось';
            cfo_del.message_success = '';
          },
          success:function (res) {
            cfo_del.message_failure = '';
            cfo_del.message_success = 'ЦФО успешно удалён';
          }
        });
      }else {
        cfo_del.message_failure = 'Опс';
        cfo_del.message_success = '';
      }
    }
  }
});

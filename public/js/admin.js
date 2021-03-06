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
        permissions_section.show = false;
        roles_section.show = false;
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
        permissions_section.show = false;
        roles_section.show = false;
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
        permissions_section.show = false;
        roles_section.show = false;
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
        permissions_section.show = true;
        permissions_section.onloading();
        roles_section.show = true;
        roles_section.onloading();
      }else if (secton == 5) {
        users_section.show = false;
        user.show = false;
        employees_section.show = false;
        employee.show = false;
        article_section.show = false;
        article.show = false;
        products_section.show = false;
        departments_section.show = false;
        cfos_section.show = false;
        permissions_section.show = false;
        roles_section.show = false;
      }
      else if (secton == 6) {
        users_section.show = false;
        user.show = false;
        employees_section.show = false;
        employee.show = false;
        article_section.show = false;
        article.show = false;
        products_section.show = false;
        departments_section.show = false;
        cfos_section.show = false;
        permissions_section.show = false;
        roles_section.show = false;
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
      {id:'10', name:'Вася', login:'Vasek228', id_employee: '102'},
      {id:'11', name:'Аделаида', login:'Adya_Sexy', id_employee: '102'}
    ]
  },
  methods: {
    user_check: function (id, id_employee, login) {
      user.new_user = false;
      user.id = id;
      user.login = login;
      user.id_employee = id_employee;
      user.onloading();
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
        url:'/api/user',
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
          users_section.users = [];
          for (var i = 0; i < res.data.length; i++) {
            users_section.users.push(
              {id: res.data[i].id, name: res.data[i].employee.fullName, id_employee: res.data[i].employee.id, login: res.data[i].username }
            )
          }
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
    id_employee: '',
    isload_too: 0,
    employees: [
      {id:'c6cbdb81-8efc-4d52-adb1-81ac87b72e68', check: false, name: 'Оржик Генадий Васильевич'},
      {id:'60d82ea4-9760-4248-9761-8a3fe87b11f6', check: false, name: 'Ыхтанг Ырнаст Ылаевич'},
      {id:'1f6fc2a2-14b1-4d89-a7d2-f3e303eb8af7', check: false, name: 'Андревасян Андрей Васильевич'},
      {id:'552e31f2-9589-4e04-98da-327319802d37', check: false, name: 'Ввмав Авиыбиьке Виьлкеиь'}
    ]
  },
  methods: {
    onloading_new: function () {
      this.login = '';
      this.passwd = '';
      this.again_passwd = '';
      this.isload = true;
      this.message_failure = '';
      this.message_success = '';
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/employee?limit=all',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          user.isload = false;
          user.loaderror = true;
          user.loadtrue = false;//не забыть изменить
          user.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          user.isload = false;
          user.loaderror = false;
          user.loadtrue = true;
          user.employees = [];
          for (var i = 0; i < res.data.length; i++) {
            user.employees.push(
              {id: res.data[i].id, check: false, name: res.data[i].fullName}
            );
          }
        }
      });
    },

    onloading: function () {
      this.isload = true;
      this.message_failure = '';
      this.message_success = '';
      this.passwd = '';
      this.again_passwd = '';
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/employee?limit=all',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          user.isload_too = -1;
          user.isload = false;
          user.loaderror = true;
          user.loadtrue = false;//не забыть изменить
          user.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          user.isload = false;
          user.loaderror = false;
          user.loadtrue = true;
            //не забыть отметить сотрудника
            user.employees = [];
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].id == user.id_employee) {
                user.employees.push(
                  {id: res.data[i].id, check: true, name: res.data[i].fullName}
                );
              } else {
                user.employees.push(
                  {id: res.data[i].id, check: false, name: res.data[i].fullName}
                );
              }
            }
        }
      });
    },

    checked: function (id) {
      for (var i = 0; i < this.employees.length; i++) {
        if (this.employees[i].id != id) {
          this.employees[i].check = false;
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
      for (var j = 0; j < this.employees.length; j++) {
        if (this.employees[j].check) {
          employee = this.employees[j].id;
          break;
        }
      }
      if (regexp.test(this.login) && regexp.test(this.passwd) && flag && employee != '') {
        $.ajax({
          /*Регистрация*/
          url:'/api/user/register',
          type:'POST',
          data: {'username': user.login, 'password': user.passwd, 'employeeId': employee},
          timeout: 30000,
          error: function (data) {
            user.message_failure = 'Создать пользователя не удалось';
            user.message_success = '';
          },
          success:function (res) {
            user.message_failure = '';
            user.message_success = 'Пользоваетель успешно создан';
            users_section.onloading();
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
      for (var j = 0; j < this.employees.length; j++) {
        if (this.employees[j].check) {
          employee = this.employees[j].id;
          break;
        }
      }
      if (regexp.test(this.login)  && flag && employee != '') {
        $.ajax({
          /*Регистрация*/
          url:'api/user/update',
          type:'POST',
          data: {'username': user.login, 'password': user.passwd, 'employeeId': employee, 'id': user.id},
          timeout: 30000,
          error: function (data) {
            user.message_failure = 'Изменить пользователя не удалось';
            user.message_success = '';
          },
          success:function (res) {
            user.message_failure = '';
            user.message_success = 'Пользоваетель успешно изменён';
            users_section.onloading();
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
      {id:'10', name:'Вася', num:'25'},
      {id:'11', name:'Аделаида', num:'26'}
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
        url:'api/employee?after=' + encodeURIComponent('1970-01-01 00:00:00+00'),
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employees_section.isload = false;
          employees_section.loaderror = true;
          employees_section.loadtrue = false; //не забыть поменять
          employees_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать пользоваетелей
          employees_section.isload = false;
          employees_section.loaderror = false;
          employees_section.loadtrue = true;
          employees_section.employees = [];
          if (res.data.length == 0) {
            employees_section.loaderror = true;
            employees_section.message_error = 'Сотрудников нет';
          }
          else {
            for (var i = 0; i < res.data.length; i++) {
              employees_section.employees.push(
                {id: res.data[i].id, name: res.data[i].fullName, num: res.data[i].createdAt}
              )
            }
          }

        }
      });
    },

    add_employee: function () {
      this.add_load = true;
      this.if_message = false;
      var num = this.employees[this.employees.length - 1].num;
      $.ajax({
        /*список пользователей*/
        url:'api/employee?after=' + encodeURIComponent(num),
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
          if (res.data.length ==0) {
            employees_section.if_message = true;
            employees_section.message = 'Больше сотрудников нет';
          } else {
            employees_section.if_message = false;
            for (var i = 0; i < res.data.length; i++) {
              employees_section.employees.push(
                {id: res.data[i].id, name: res.data[i].fullName, num: res.data[i].createdAt}
              )
            }
          }
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
    ],
    departments_old: []
  },
  methods: {
    onloading_new: function () {
      this.isload = true;
      this.message_failure = '';
      this.message_success = '';
      employee.id = '';
      employee.FIO = '';
      employee.birthday = '';
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
          employee.loadtrue = false;//не забыть изменить
          employee.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          employee.isload = false;
          employee.loaderror = false;
          employee.loadtrue = true;
          employee.departments = [];
          for (var i = 0; i < res.data.length; i++) {
            employee.departments.push(
              {id: res.data[i].id, name: res.data[i].shortName, check: false});
          }
        }
      });
    },

    onloading: function (id) {
      this.isload = true;
      this.id = id;
      this.isload_too = 0;
      this.message_failure = '';
      this.message_success = '';
      $('.datepicker').pickadate({
       selectMonths: true, // Creates a dropdown to control month
       selectYears: 15 // Creates a dropdown of 15 years to control year
      });
      $.ajax({
        /*список список сотрудников отделов*/
        url:'api/department',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          employee.isload_too = -1;
          employee.isload = false;
          employee.loaderror = true;
          employee.loadtrue = false;//не забыть изменить
          employee.message_error = 'Загрузить не удалась';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          employee.departments = [];
          for (var i = 0; i < res.data.length; i++) {
            employee.departments.push(
              {id: res.data[i].id, name: res.data[i].shortName, check: false});
          }
          if (employee.isload_too == 1) {
            employee.isload = false;
            employee.loaderror = false;
            employee.loadtrue = true;
            employee.checked_department();
          }else {
            employee.isload_too++;
          }
        }
      });
      $.ajax({
        /*информация о сотруднике*/
        url:'api/employee/' + encodeURIComponent(id),
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
          employee.id = id;
          employee.FIO = res.data.fullName;
          employee.birthday = res.data.birthDate.substr(0, 10);
          if (res.data.sex == true) {
            employee.sex = true;
            $("#sex1").attr("checked","checked");
            $("#sex2").removeAttr("checked");

          }else {
            employee.sex = false;
            $("#sex2").attr("checked","checked");
            $("#sex1").removeAttr("checked");
          }
          employee.departments_old = [];
          for (var i = 0; i < res.data.departments.length; i++) {
            employee.departments_old.push(res.data.departments[i].id);
          }
          if (employee.isload_too == 1) {
            employee.isload = false;
            employee.loaderror = false;
            employee.loadtrue = true;
            employee.checked_department();
          }else {
            employee.isload_too++;
          }
        }
      });
    },

    checked_department: function () {
      for (var i = 0; i < employee.departments_old.length; i++) {
        for (var j = 0; j < employee.departments.length; j++) {
          if (employee.departments[j].id == employee.departments_old[i]) {
            employee.departments[j].check = true;
          }
        }
      }
    },

    create_employee: function () {
      var regexp = /^[А-Яа-я-\s]{2,50}$/;
      var sex = false;
      if ($("#sex1").prop("checked")){
        sex = true;
      }
      var department = [];
      for (var i = 0; i < this.departments.length; i++) {
        if (this.departments[i].check) {
          department.push(this.departments[i].id);
        }
      }
      if (regexp.test(this.FIO) && this.birthday != '' && department != '') {
        $.ajax({
          /*Добавление сотрудника*/
          url:'/api/employee',
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
            employees_section.onloading();
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
      var department = [];
      for (var i = 0; i < this.departments.length; i++) {
        if (this.departments[i].check) {
          department.push(this.departments[i].id);
        }
      }
      alert(employee.birthday);
      if (regexp.test(this.FIO) && this.birthday != '' && this.id != '') {
        $.ajax({
          /*Добавление сотрудника*/
          url:'/api/employee',
          type:'PUT',
          data: {'fullName': employee.FIO, 'sex': sex, 'birthDate': employee.birthday, 'id': employee.id, 'department': department},
          timeout: 30000,
          error: function (data) {
            employee.message_failure = 'Создать изменить не удалось';
            employee.message_success = '';
          },
          success:function (res) {
            employee.message_failure = '';
            employee.message_success = 'Сотрудник успешно изменён';
            employees_section.onloading();
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
      {id:'10', name:'Мы команда', cfo:'Наша банда', cfo_id:'25'},
      {id:'11', name:'Жопа', cfo:'ЖОпа', cfo_id:'2'}
    ]
  },
  methods: {
    article_check: function (id, cfo_id, name) {
      article.new_article = false;
      article.id = id;
      article.cfo_id = cfo_id;
      article.name = name;
      article.onloading();
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
        url:'/api/cost-item',
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
          article_section.articles = [];
          for (var i = 0; i < res.data.length; i++) {
            article_section.articles.push(
              {id: res.data[i].id, name: res.data[i].name, cfo: res.data[i].frc.name, cfo_id: res.data[i].frc.id}
            );
          }
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
    cfo_id: '',
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
      this.name = '';
      this.id = '';
      this.cfo_id = '';
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
          article.cfos = [];
          for (var i = 0; i < res.data.length; i++) {
            article.cfos.push(
              {id: res.data[i].id, name: res.data[i].name, check: false});
          }
        }
      });
    },

    onloading: function () {
      this.isload = true;
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
          article.isload = false;
          article.loaderror = false;
          article.loadtrue = true;
          article.cfos = [];
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].id == article.cfo_id) {
              article.cfos.push(
                {id: res.data[i].id, name: res.data[i].name, check: true});
            }else {
              article.cfos.push(
                {id: res.data[i].id, name: res.data[i].name, check: false});
            }
          }
        }
      });
    },

    checked: function (id) {
      for (var i = 0; i < this.cfos.length; i++) {
        if (this.cfos[i].id != id) {
          this.cfos[i].check = false;
        }
      }
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
          url:'api/cost-item',
          type:'POST',
          data: {'name': article.name, 'frcId': cfo},
          timeout: 30000,
          error: function (data) {
            article.message_failure = 'Создать статью не удалось';
            article.message_success = '';
          },
          success:function (res) {
            article.message_failure = '';
            article.message_success = 'Статья успешно создана';
            article_section.onloading();
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
      if (regexp.test(this.name) && cfo != ''&& this.id != '') {
        $.ajax({
          /*изменение  стстьи*/
          url:'api/cost-item',
          type:'PUT',
          data: {'name': article.name, 'frcId': cfo, 'id': article.id},
          timeout: 30000,
          error: function (data) {
            article.message_failure = 'Изменить статью не удалось';
            article.message_success = '';
          },
          success:function (res) {
            article.message_failure = '';
            article.message_success = 'Статья успешно изменена';
            article_section.onloading();
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
        url:'api/product?costItemId=' + products_section.article_id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          products_section.isload = false;
          products_section.loaderror = true;
          products_section.loadtrue = false; //не забыть поменять
          products_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать товарные позиции
          products_section.isload = false;
          products_section.loaderror = false;
          products_section.loadtrue = true;
          products_section.products = [];
          for (var i = 0; i < res.data.length; i++) {
            products_section.products.push(
              {id: res.data[i].id, name: res.data[i].name, price: res.data[i].price}
            );
          }
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
      alert(product.name + product.price + product.article_id)
      if (regexp.test(this.name) && this.price >= 0) {
        $.ajax({
          /*Добавление товара*/
          url:'api/product',
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
            products_section.onloading();
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
          url:'api/product',
          type:'PUT',
          data: {'name': product.name, 'price': product.price, 'id': product.id, 'costItemId': product.article_id},
          timeout: 30000,
          error: function (data) {
            product.message_failure = 'Изменить товар не удалось';
            product.message_success = '';
          },
          success:function (res) {
            product.message_failure = '';
            product.message_success = 'Товар успешно изменён';
            products_section.onloading();
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
          departments_section.loadtrue = false; //не забыть поменять
          departments_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          departments_section.isload = false;
          departments_section.loaderror = false;
          departments_section.loadtrue = true;
          if (res.data.length == 0) {
            departments_section.loaderror = false;
            departments_section.loadtrue = false;
            departments_section.message_error = 'Отделов нет';
          } else {
            departments_section.departments = [];
            for (var i = 0; i < res.data.length; i++) {
              departments_section.departments.push(
                {id: res.data[i].id, fullname: res.data[i].fullName, shortname: res.data[i].shortName});
            }
          }
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
      var regexpfull = /^[а-яё\w\d\- ]{1,200}$/i;
      var regexpshort = /^[а-яё\w\d\- ]{1,50}$/i;

      if (regexpfull.test(this.fullname) && regexpshort.test(this.shortname)) {
        $.ajax({
          /*Добавление отдела*/
          url:'api/department',
          type:'POST',
          data: {'fullName': department.fullname, 'shortName': department.shortname},
          timeout: 30000,
          error: function (data) {
            department.message_failure = 'Добавить отдел не удалось';
            department.message_success = '';
          },
          success:function (res) {
            department.message_failure = '';
            department.message_success = 'Отдел успешно добавлен';
            departments_section.onloading();
            $('#department').modal('close');
          }
        });
      }else {
        department.message_failure = 'Заполните поля правильно';
        department.message_success = '';
      }
    },

    update_department: function () {
      var regexpfull = /^[а-яё\w\d\- ]{1,200}$/i;
      var regexpshort = /^[а-яё\w\d\- ]{1,50}$/i;

      if (regexpfull.test(this.fullname) && regexpshort.test(this.shortname) && this.id != '') {
        $.ajax({
          /*Изменение отдела*/
          url:'api/department',
          type:'PUT',
          data: {'fullName': department.fullname, 'shortName': department.shortname, 'id': department.id},
          timeout: 30000,
          error: function (data) {
            department.message_failure = 'Изменить отдел не удалось';
            department.message_success = '';
          },
          success:function (res) {
            department.message_failure = '';
            department.message_success = 'Отдел успешно изменён';
            departments_section.onloading();
            $('#department').modal('close');
          }
        });
      }else {
        department.message_failure = 'Заполните поля правильно';
        department.message_success = '';
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
            departments_section.onloading();
            $('#department_del').modal('close');
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
          if (res.data.length == 0) {
            cfos_section.loaderror = false;
            cfos_section.loadtrue = false;
            cfos_section.message_error = 'Отделов нет';
          } else {
            cfos_section.cfos = [];
            for (var i = 0; i < res.data.length; i++) {
              cfos_section.cfos.push(
                {id: res.data[i].id, name: res.data[i].name});
            }
          }
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
          url:'api/frc',
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
            cfos_section.onloading();
            $('#cfo').modal('close');
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
          url:'api/frc',
          type:'PUT',
          data: {'name': cfo.name, 'id': cfo.id},
          timeout: 30000,
          error: function (data) {
            cfo.message_failure = 'Изменить ЦФО не удалось';
            cfo.message_success = '';
          },
          success:function (res) {
            cfo.message_failure = '';
            cfo.message_success = 'ЦФО успешно изменён';
            cfos_section.onloading();
            $('#cfo').modal('close');
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
            cfos_section.onloading();
            $('#cfo_del').modal('close');
          }
        });
      }else {
        cfo_del.message_failure = 'Опс';
        cfo_del.message_success = '';
      }
    }
  }
});

var permissions_section = new Vue({
  el: '#permissions_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    message_error: '',
    permissions: [
      {id:'10', name:'Дидидидави'},
      {id:'101', name:'Авиваи'},
      {id:'102', name:'Блед'},
    ]
  },
  methods: {
    item_check: function (id, name) {
      permission.new_product = false;
      permission.id = id;
      permission.name = name;
      $('#permission').modal('open');
    },

    new_item: function () {
      permission.new_product = true;
      permission.id = '';
      permission.name = '';
      $('#permission').modal('open');
    },

    del_item: function (id, name) {
      permission_del.id = id;
      permission_del.name = name;
      $('#permission_del').modal('open');
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список отделов*/
        url:'api/permission',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          permissions_section.isload = false;
          permissions_section.loaderror = true;
          permissions_section.loadtrue = true; //не забыть поменять
          permissions_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          permissions_section.isload = false;
          permissions_section.loaderror = false;
          permissions_section.loadtrue = true;

        }
      });
    }
  }
});

var permission = new Vue({
  el: '#permission',
  data: {
    new_product: true,
    name: '',
    id: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    create_item: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{1,40}$/i;

      if (regexp.test(this.name)) {
        $.ajax({
          /*Добавление разрешения*/
          url:'api/permission/create',
          type:'POST',
          data: {'name': permission.name},
          timeout: 30000,
          error: function (data) {
            permission.message_failure = 'Добавить разрешение не удалось';
            permission.message_success = '';
          },
          success:function (res) {
            permission.message_failure = '';
            permission.message_success = 'Разрешение успешно добавлен';
          }
        });
      }else {
        permission.message_failure = 'Заполните поля правильно';
        permission.message_success = '';
      }
    },

    update_item: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{1,40}$/i;

      if (regexp.test(this.name) && this.id != '') {
        $.ajax({
          /*Изменение разрешения*/
          url:'api/permission/update',
          type:'POST',
          data: {'name': permission.name, 'id': permission.id},
          timeout: 30000,
          error: function (data) {
            permission.message_failure = 'Изменить разрешение не удалось';
            permission.message_success = '';
          },
          success:function (res) {
            permission.message_failure = '';
            permission.message_success = 'Разрешение успешно изменён';
          }
        });
      }else {
        permission.message_failure = 'Заполните поля правильно';
        permission.message_success = '';
      }
    }
  }
});

var permission_del = new Vue({
  el: '#permission_del',
  data: {
    id: '',
    name: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    del_item: function () {
      if (this.id != '') {
        $.ajax({
          /*Удаление разрешения*/
          url:'api/permission',
          type:'DELETE',
          data: {'id': permission_del.id},
          timeout: 30000,
          error: function (data) {
            permission_del.message_failure = 'Удалить Разрешение не удалось';
            permission_del.message_success = '';
          },
          success:function (res) {
            permission_del.message_failure = '';
            permission_del.message_success = 'Разрешение успешно удалён';
          }
        });
      }else {
        permission_del.message_failure = 'Опс';
        permission_del.message_success = '';
      }
    }
  }
});

var roles_section = new Vue({
  el: '#roles_section',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    message_error: '',
    roles: [
      {id:'10', name:'Дидидидави'},
      {id:'101', name:'Авиваи'},
      {id:'102', name:'Блед'},
    ]
  },
  methods: {
    item_check: function (id, name) {
      role.new_product = false;
      role.id = id;
      role.name = name;
      $('#role').modal('open');
    },

    new_item: function () {
      role.new_product = true;
      role.id = '';
      role.name = '';
      $('#role').modal('open');
    },

    del_item: function (id, name) {
      role_del.id = id;
      role_del.name = name;
      $('#role_del').modal('open');
    },

    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      $.ajax({
        /*список отделов*/
        url:'api/role',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          roles_section.isload = false;
          roles_section.loaderror = true;
          roles_section.loadtrue = true; //не забыть поменять
          roles_section.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          roles_section.isload = false;
          roles_section.loaderror = false;
          roles_section.loadtrue = true;

        }
      });
    }
  }
});

var role = new Vue({
  el: '#role',
  data: {
    new_product: true,
    name: '',
    id: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    create_item: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,40}$/i;

      if (regexp.test(this.name)) {
        $.ajax({
          /*Добавление разрешения*/
          url:'api/role/create',
          type:'POST',
          data: {'name': role.name},
          timeout: 30000,
          error: function (data) {
            role.message_failure = 'Добавить роль не удалось';
            role.message_success = '';
          },
          success:function (res) {
            role.message_failure = '';
            role.message_success = 'Роль успешно добавлена';
          }
        });
      }else {
        role.message_failure = 'Заполните поля правильно';
        role.message_success = '';
      }
    },

    update_item: function () {
      var regexp = /^[а-яё\w\d_\-:. ]{4,40}$/i;

      if (regexp.test(this.name) && this.id != '') {
        $.ajax({
          /*Изменение разрешения*/
          url:'api/role/update',
          type:'POST',
          data: {'name': role.name, 'id': role.id},
          timeout: 30000,
          error: function (data) {
            role.message_failure = 'Изменить роль не удалось';
            role.message_success = '';
          },
          success:function (res) {
            role.message_failure = '';
            role.message_success = 'Роль успешно изменёна';
          }
        });
      }else {
        role.message_failure = 'Заполните поля правильно';
        role.message_success = '';
      }
    }
  }
});

var role_del = new Vue({
  el: '#role_del',
  data: {
    id: '',
    name: '',
    message_failure: '',
    message_success: ''
  },
  methods: {
    del_item: function () {
      if (this.id != '') {
        $.ajax({
          /*Удаление разрешения*/
          url:'api/role',
          type:'DELETE',
          data: {'id': role_del.id},
          timeout: 30000,
          error: function (data) {
            role_del.message_failure = 'Удалить роль не удалось';
            role_del.message_success = '';
          },
          success:function (res) {
            role_del.message_failure = '';
            role_del.message_success = 'Роль успешно удалёна';
          }
        });
      }else {
        role_del.message_failure = 'Опс';
        role_del.message_success = '';
      }
    }
  }
});

/*var permissions_appointment = new Vue({
  el: '#permissions_appointment',
  data: {
    show: false,
    isload: true,
    loaderror: false,
    loadtrue: false,
    message_error: '',
    loadtoo: 0,
    roles: [
      {id:'10', name:'Дидидидави', check: false},
      {id:'101', name:'Авиваи', check: false},
      {id:'102', name:'Блед', check: false},
    ]
    permissions: [
      {id:'101', name:'Дидидидави', check: false},
      {id:'1011', name:'Авиваи', check: false},
      {id:'1021', name:'Блед', check: false},
    ]
    permissions_check: [
      {id:'101', name:'Дидидидави', check: false},
    ]
  },
  methods: {
    onloading: function () {
      this.isload = true;
      this.loaderror = false;
      this.loadtrue = false;
      this.loadtoo = 0;
      $.ajax({
        //список ролей
        url:'api/role',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          permissions_appointment.loadtoo = -1;
          permissions_appointment.isload = false;
          permissions_appointment.loaderror = true;
          permissions_appointment.loadtrue = true; //не забыть поменять
          permissions_appointment.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          if (permissions_appointment.loadtoo == 2) {
            //Тут нужно обработать роли
            permissions_appointment.isload = false;
            permissions_appointment.loaderror = false;
            permissions_appointment.loadtrue = true;

          }else {
            permissions_appointment.loadtoo++;

          }
        }
      });
      $.ajax({
        //список уже назначенных разрешений
        url:'api/role/permissions?id=',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          permissions_appointment.loadtoo = -1;
          permissions_appointment.isload = false;
          permissions_appointment.loaderror = true;
          permissions_appointment.loadtrue = true; //не забыть поменять
          permissions_appointment.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          if (permissions_appointment.loadtoo == 2) {
            //Тут нужно обработать роли
            permissions_appointment.isload = false;
            permissions_appointment.loaderror = false;
            permissions_appointment.loadtrue = true;

          }else {
            permissions_appointment.loadtoo++;

          }
        }
      });
      $.ajax({
        //список разрешений
        url:'api/permission',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          permissions_appointment.loadtoo = -1;
          permissions_appointment.isload = false;
          permissions_appointment.loaderror = true;
          permissions_appointment.loadtrue = true; //не забыть поменять
          permissions_appointment.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          if (permissions_appointment.loadtoo == 2) {
            //Тут нужно обработать разрешения
            permissions_appointment.isload = false;
            permissions_appointment.loaderror = false;
            permissions_appointment.loadtrue = true;

          }else {
            permissions_appointment.loadtoo++;

          }
        }
      });
    },

    save: function () {
      var role = '';
      for (var i = 0; i < this.roles.length; i++) {
        if (this.roles[i].check) {
          role = this.roles[i].id;
          break;
        }
      }
      var permission = [];
      for (var i = 0; i < this.roles.length; i++) {
        if (this.roles[i].check) {
          permission.push(this.roles[i].id)
        }
      }
      $.ajax({
        //Назначение разрешений на роль
        url:'api/setpermissions',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          permissions_appointment.loadtoo = -1;
          permissions_appointment.isload = false;
          permissions_appointment.loaderror = true;
          permissions_appointment.loadtrue = true; //не забыть поменять
          permissions_appointment.message_error = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          if (permissions_appointment.loadtoo == 1) {
            //Тут нужно обработать разрешения
            permissions_appointment.isload = false;
            permissions_appointment.loaderror = false;
            permissions_appointment.loadtrue = true;

          }else {
            permissions_appointment.loadtoo = 1;

          }
        }
      });
    }
  }
});*/

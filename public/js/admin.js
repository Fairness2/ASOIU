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
        users_section.show = true;
        users_section.onloading();
      }else if (section == 2) {
        users_section.show = false;
      }else if (section == 3) {
        users_section.show = false;
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
      alert(id);
    },

    new_user: function () {
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
    new_user: false,
    change_passwd: false,
    login: '',
    passwd: '',
    again_passwd: '',
    id: '',
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

    },

    change_user: function () {

    },

    del_user: function () {

    }
  }
});

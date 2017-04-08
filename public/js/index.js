var application = new Vue({
  el: '#application',
  data: {
    seen_check: false, //Видимость поля выбора
    seen_del: false, //Видимость поля удаления
    load_items_check: false, //загрузка первой партии элементов
    check_add_check: false, //загрузка дополнительных партий элементов
    not_year: true,
    items:[]
  },
  methods:{
    hiden_v: function () {
      this.seen_check = false;
      this.seen_del = false;
      this.load_items_check = false;
      this.check_add_check = false
    },

    check_v: function () {
      this.load_items_check = false;
      this.check_add_check = false
      this.seen_check = true;
      this.seen_del = false;
    },

    find_year_check:function () {
      this.load_items_check = true;
    },

    add_items_check: function () {
      this.check_add_check = true;
    },

    del_v: function () {
      this.seen_check = false;
      this.seen_del = true;
    }
  }
});

var cfo = new Vue({
  el: '#cfo',
  data:{
    seen_check: false,
    seen_del: false,
    load_items: true,
    items:[
      {message: 'Заявок ещё нет!'}
    ]
  },
  methods:{
    hiden_v: function () {
      this.seen_check = false;
      this.seen_del = false;
    },
    check_v: function () {
      this.load_items = true;
      this.seen_check = true;
      this.seen_del = false;
    },
    del_v: function () {
      this.seen_check = false;
      this.seen_del = true;
    }
  }
});

var company = new Vue({
  el: '#company',
  data:{
    seen_check: false,
    seen_del: false
  },
  methods:{
    hiden_v: function () {
      this.seen_check = false;
      this.seen_del = false;
    },
    check_v: function () {
      this.seen_check = true;
      this.seen_del = false;
    },
    del_v: function () {
      this.seen_check = false;
      this.seen_del = true;
    }
  }
});

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

//заявки
var application = new Vue({
  el: '#application',
  data: {
    seen_check: false, //Видимость поля выбора
    load_items_check: false, //загрузка первой партии элементов
    add_check: false, //загрузка дополнительных партий элементов
    message: '',
    items:[
      {message: 'Вот', id: 'f3bb93ef-ef44-4cb1-bf42-60603c6bb023', num:'10'}
    ]
  },
  methods:{
    hiden_v: function () {
      this.seen_check = false;
      this.load_items_check = false;
      this.check_add_check = false
    },

    check_v: function () {
      this.load_items_check = true;
      this.add_check = false;
      this.seen_check = true;
      $.ajax({
        url:'api/request?after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          application.message = 'Ошибка';
          application.load_items_check = false;
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          application.message = 'Всё типтоп';
          application.load_items_check = false;
        }
      });
    },

    add_items_check: function () {
      this.add_check = true;
      var num = 0;
      var lenghtit = this.items.lenght;
      if (lenghtit == 0)
        num = this.items[lenghtit].num;
      $.ajax({
        url:'api/request?after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          application.add_check = false;
          application.message = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          application.add_check = false;
          application.message = 'Всё типтоп';
        }
      });
    },

    check: function (id) {
        //Тут нужно направить на страницу с элементом
        alert(id)
        location.replace("/request.html?id=" + id);
    },
  }
});

//сметы цфо
var cfo = new Vue({
  el: '#cfo',
  data:{
    seen_check: false,
    seen_del: false,
    load_items_check: false,
    add_check: false,
    load_items_del: false,
    add_del: false,
    message_check: '',
    message_del: '',
    items_check:[
      {message: 'Вот', id: 'f3bb93ef-ef44-4cb1-bf42-60603c6bb023', num:'10'}
    ],
    items_del:[
      {message: 'Вот', id: 'f3bb93ef-ef44-4cb1-bf42-60603c6bb023', num:'10'}
    ]
  },
  methods:{
    hiden_v: function () {
      this.seen_check = false;
      this.seen_del = false;
      this.load_items_check = false;
      this.add_check = false
      this.load_items_del = false;
      this.add_del = false
    },
    check_v: function () {
      this.load_items_check = true;
      this.seen_check = true;
      this.seen_del = false;
      this.add_check = false;
      this.load_items_del = false;
      this.add_del = false
      $.ajax({
        url:'api/estimate?after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          cfo.load_items_check = false;
          cfo.message_check = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          cfo.load_items_check = false;
          cfo.message_check = 'Всё типтоп';
        }
      });
    },

    add_items_check: function () {
      this.add_check = true;
      var num = 0;
      var lenghtit = this.items_check.lenght;
      if (lenghtit == 0)
        num = this.items_check[lenghtit].num;
      $.ajax({
        url:'api/estimate?after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          cfo.add_check = false;
          cfo.message_check = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          cfo.add_check = false;
          cfo.message_check = 'Всё типтоп';
        }
      });
    },

    check: function (id) {
        //Тут нужно направить на страницу с элементом
        alert(id)
        location.replace("/estimate.html?id=" + id);
    },

    del_v: function () {
      this.load_items_check = false;
      this.seen_check = false;
      this.seen_del = true;
      this.add_check = false;
      this.load_items_del = true;
      this.add_del = false
      $.ajax({
        url:'api/estimate?after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          cfo.load_items_del = false;
          cfo.message_del = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          cfo.load_items_del = false;
          cfo.message_del = 'Всё типтоп';
        }
      });
    },

    add_items_del: function () {
      this.add_del = true;
      var num = 0;
      var lenghtit = this.items_del.lenght;
      if (lenghtit == 0)
        num = this.items_del[lenghtit].num;
      $.ajax({
        url:'api/estimate?after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          cfo.add_del = false;
          cfo.message_del = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          cfo.add_del = false;
          cfo.message_del = 'Всё типтоп';
        }
      });
    },

    del: function (id) {
        //Тут нужно направить на страницу с элементом
        alert(id)
        win_del_est_cfo.id = id;
        $('#del_estimate_cfo').modal('open');
    }
  }
});

//сметы предприятия
var company = new Vue({
  el: '#company',
  data:{
    seen_check: false,
    seen_del: false,
    load_items_check: false,
    add_check: false,
    load_items_del: false,
    add_del: false,
    message_check: '',
    message_del: '',
    items_check:[
      {message: 'Вот', id: 'f3bb93ef-ef44-4cb1-bf42-60603c6bb023', num:'10'}
    ],
    items_del:[
      {message: 'Вот', id: 'f3bb93ef-ef44-4cb1-bf42-60603c6bb023', num:'10'}
    ]
  },
  methods:{
    hiden_v: function () {
      this.seen_check = false;
      this.seen_del = false;
      this.load_items_check = false;
      this.add_check = false
      this.load_items_del = false;
      this.add_del = false
    },
    check_v: function () {
      this.load_items_check = true;
      this.seen_check = true;
      this.seen_del = false;
      this.add_check = false;
      this.load_items_del = false;
      this.add_del = false
      $.ajax({
        url:'api/estimate?company=true&after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          company.load_items_check = false;
          company.message_check = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          company.load_items_check = false;
          company.message_check = 'Всё типтоп';
        }
      });
    },

    add_items_check: function () {
      this.add_check = true;
      var num = 0;
      var lenghtit = this.items_check.lenght;
      if (lenghtit == 0)
        num = this.items_check[lenghtit].num;
      $.ajax({
        url:'api/estimate?company=true&after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          company.add_check = false;
          company.message_check = 'Ошибка';
          //JSON.parse(data)
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          company.add_check = false;
          company.message_check = 'Всё типтоп';
        }
      });
    },

    check: function (id) {
        //Тут нужно направить на страницу с элементом
        alert(id)
        location.replace("/estimate_company.html?id=" + id);
    },

    del_v: function () {
      this.load_items_check = false;
      this.seen_check = false;
      this.seen_del = true;
      this.add_check = false;
      this.load_items_del = true;
      this.add_del = false
      $.ajax({
        url:'api/estimate?company=true&after=' + 0,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          company.load_items_del = false;
          company.message_del = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          company.load_items_del = false;
          company.message_del = 'Всё типтоп';
        }
      });
    },

    add_items_del: function () {
      this.add_del = true;
      var num = 0;
      var lenghtit = this.items_del.lenght;
      if (lenghtit == 0)
        num = this.items_del[lenghtit].num;
      $.ajax({
        url:'api/estimate?company=true&after=' + num,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          company.add_del = false;
          company.message_del = 'Ошибка';
        },
        success:function (res) {
          //Тут нужно добавить полученные элементы в массим данных
          company.add_del = false;
          company.message_del = 'Всё типтоп';
        }
      });
    },

    del: function (id) {
        //Тут нужно направить на страницу с элементом
        alert(id)
        win_del_est_com.id = id;
        $('#win_del_est_com').modal('open');
    },
  }
});

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

//Окно новая заявка
var win_new_app = new Vue ({
  el: '#new_application',
  data:{
    message: '',
    isload: false
  },
  methods:{
    new_el: function () {
      var name = $('#name_application').val();
      var regexp = /^[а-яa-z0-9_-]{6,20}$/i;
      if (regexp.test(name)) {
        location.replace("/request.html?name=" + name);
      }
      else {
        this.message = 'Не правильно введено название';
      }
    }
  }
});

//Окно новая смета цфо
var win_new_est_cfo = new Vue ({
  el: '#new_estimate_cfo',
  data:{
    message: '',
    isload: false
  },
  methods:{
    new_el: function () {
      var name = $('#name_estimate_cfo').val();
      var regexp = /^[а-яa-z0-9_-]{6,20}$/i;
      if (regexp.test(name)) {
        location.replace("/estimate.html?name=" + name);
      }
      else {
        this.message = 'Не правильно введено название';
      }
    }
  }
});

//Окно новая смета предприятия
var win_new_est_com = new Vue ({
  el: '#new_estimate_company',
  data:{
    message: '',
    isload: false
  },
  methods:{
    new_el: function () {
      var name = $('#name_estimate_company').val();
      var regexp = /^[а-яa-z0-9_-]{6,20}$/i;
      if (regexp.test(name)) {
        location.replace("/estimate_company.html?name=" + name);
      }
      else {
        this.message = 'Не правильно введено название';
      }
    }
  }
});

//Окно удалить смету цфо
var win_del_est_cfo = new Vue ({
  el: '#del_estimate_cfo',
  data:{
    id: '',
    isload: false
  },
  methods:{
    del_el: function () {
      $.ajax({
        url:'api/estimate',
        type:'DELETE',
        data: {'id': win_del_est_cfo.id},
        beforeSend: function (data) {
          win_del_est_cfo.isload = true;
        },
        timeout: 30000,
        error: function (data) {
          win_del_est_cfo.isload = false;
          win_del_est_cfo.message = 'Ошибка';
        },
        success:function (res) {
          win_del_est_cfo.isload = false;
          win_del_est_cfo.message = 'Всё типтоп';
        }
      });
    }
  }
});

//Окно удалить смету предприятия
var win_del_est_com = new Vue ({
  el: '#del_estimate_com',
  data:{
    id: '',
    isload: false
  },
  methods:{
    del_el: function () {
      $.ajax({
        url:'api/estimate',
        type:'DELETE',
        data: {'id': win_del_est_com.id},
        beforeSend: function (data) {
          win_del_est_com.isload = true;
        },
        timeout: 30000,
        error: function (data) {
          win_del_est_com.isload = false;
          win_del_est_com.message = 'Ошибка';
        },
        success:function (res) {
          win_del_est_com.isload = false;
          win_del_est_com.message = 'Всё типтоп';
        }
      });
    }
  }
});

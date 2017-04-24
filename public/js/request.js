//Получить из урл даные
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

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

//Тело
var body_con = new Vue({
  el:'#body_con',
  data:{
    isload: true,//если страница загружается
    loadtrue: false,//усли страница загрузилось удачно
    loaderror: false,//если страница загрузилась не удачно
    tobe: true,//показать кнопки
    error_art: false, //Сообщение о ошибке статей
    message_error: '', //Сообщение при ошибке загрузки
    name_request: '', //название заявки
    year: '', //год заявки
    name_maker: '', //создатель
    id: '',
    periods:[
      {id: 'dfbrd3FWA', name: 'Январь'},
      {id: 'beasvzb', name: 'Февраль'},
      {id: 'fdbsrd434z', name: 'Апрель'},
      {id: 'v5hw5sgb', name: 'Май'},
    ],
    articles: [ //статьи расходов
      {id: '10', name:'Мебель', table_show: false, items:[
          {name: 'Биван', id: '66', //товарные позиции
          periods: [
            {id: 'dfbrd3FWA', value: '2'},
            {id: 'beasvzb', value: '2'},
            {id: 'fdbsrd434z', value: '2'},
            {id: 'v5hw5sgb', value: '2'},
          ]
          }
        ]
      },
      {id: '11', name:'Попаболь', table_show: false, items:[
          {name: 'БОЛЬ', id: '666',
          periods: [
            {id: 'dfbrd3FWA', value: '2'},
            {id: 'beasvzb', value: '2'},
            {id: 'fdbsrd434z', value: '2'},
            {id: 'v5hw5sgb', value: '2'},
          ]}
        ]
      }
    ],
    cfos: [],
    message_cfo: '',
    view: false
  },

  methods:{
    //загрузка страницы
    time_to_load: function () {
      this.isload = true;
      this.loadtrue = false;
      this.loaderror = false;
      this.tobe = false;
      $.ajax({
        url: '/api/period',
        type: 'GET',
        timeout: 30000,
        error: function (data) {
          body_con.error_art = true;
          body_con.message_art = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //тут нужны периоды
          body_con.periods = [];
          for (var i = 0; i < res.data.length; i++) {
            body_con.periods.push(
              {id: res.data[i].id, name: res.data[i].name}
            );

          }
          body_con.time_to_load1();
        }
      });
      $.ajax({
        /*список список отделов*/
        url:'api/frc',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          body_con.message_cfo = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          //Тут нужно обработать отделы
          body_con.message_cfo = '';
          body_con.cfos = [];
          for (var i = 0; i < res.data.length; i++) {
            body_con.cfos.push(
              {id: res.data[i].id, name: res.data[i].name, check: false});
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
      this.time_to_cfo(id);
    },

    time_to_cfo: function (id) {
      $.ajax({
        /*список всех статей и их товарный позиций*/
        url:'/api/cost-item?with=products&frcId=' + id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          body_con.error_art = true;
          body_con.message_art = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          body_con.articles = [];
          var products = [];
          var periods_item = [];
          for (var i = 0; i < body_con.periods.length; i++) {
            periods_item.push(
              {id: body_con.periods[i].id, value: ''}
            );
          }
          for (var i = 0; i < res.data.length; i++) {
            products = [];
            for (var j = 0; j < res.data[i].products.length; j++) {
              products.push(
                {
                  id: res.data[i].products[j].id,
                  name: res.data[i].products[j].name,
                  periods: JSON.parse(JSON.stringify(periods_item))
                }
              );
            }
            body_con.articles.push(
              {
                id: res.data[i].id,
                name: res.data[i].name,
                table_show: false,
                items: JSON.parse(JSON.stringify(products))
              }
            );
          }
          body_con.time_to_load2();
        }
      });
    },

    time_to_load1: function () {
      $.ajax({
        /*список всех статей и их товарный позиций*/
        url:'/api/cost-item?with=products',
        type:'GET',
        timeout: 30000,
        error: function (data) {
          body_con.error_art = true;
          body_con.message_art = 'Пожалуйста перезагрузите страницу';
        },
        success:function (res) {
          body_con.articles = [];
          var products = [];
          var periods_item = [];
          for (var i = 0; i < body_con.periods.length; i++) {
            periods_item.push(
              {id: body_con.periods[i].id, value: ''}
            );
          }
          for (var i = 0; i < res.data.length; i++) {
            products = [];
            for (var j = 0; j < res.data[i].products.length; j++) {
              products.push(
                {
                  id: res.data[i].products[j].id,
                  name: res.data[i].products[j].name,
                  periods: JSON.parse(JSON.stringify(periods_item))
                }
              );
            }
            body_con.articles.push(
              {
                id: res.data[i].id,
                name: res.data[i].name,
                table_show: false,
                items: JSON.parse(JSON.stringify(products))
              }
            );
          }
          body_con.time_to_load2();
        }
      });
    },

    time_to_load2: function () {
      var getval = getUrlVars();
      if (getval['id']) {
        this.id = getval['id']
        this.view = true;
        $.ajax({
          //загрузка уже существующей заявки
          url:'api/request/' + body_con.id,
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.isload = false;
            body_con.loadtrue = false;
            body_con.loaderror = true;
            body_con.message_error = 'Ошибка';
          },
          success:function (res) {
            //Тут нужно получить данные заявки и обработать
            body_con.name_maker = res.data.requester.fullName;
            body_con.year = res.data.year;
            body_con.time_to_index(res.data.items);
          }
        });
      }
      else {
        var date = new Date();
        this.year = date.getUTCFullYear() + 1;
        this.name_maker = 'Вася';
        this.isload = false;
        this.loadtrue = true;
        this.tobe = true;
        this.loaderror = false;
      }
    },

    time_to_index: function (items) {

      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < body_con.articles.length; j++) {
          if (items[i].product.costItemId == body_con.articles[j].id) {
            for (var g = 0; g < body_con.articles[j].items.length; g++) {
              if (items[i].productId == body_con.articles[j].items[g].id) {
                for (var q = 0; q < body_con.articles[j].items[g].periods.length; q++) {
                  if (items[i].periodId == body_con.articles[j].items[g].periods[q].id) {
                    body_con.articles[j].items[g].periods[q].value = items[i].quantity;
                  }
                }
              }
            }
          }
        }
      }

      this.isload = false;
      this.loadtrue = true;
      this.tobe = true;
      this.loaderror = false;
    },

    //Показать таблицу с товарными позициями по статье
    show: function (id) {
      for (var i = 0; i < this.articles.length; i++)
      {
        if(this.articles[i].id == id)
        {
          this.articles[i].table_show = true;
        }else {
          this.articles[i].table_show = false;
        }
      }
    },

    save: function () {
      $('#send_application').modal('open');
    }

  }
});

//Окно созранения сметы
var send_application = new Vue({
  el: '#send_application',
  data:{
    message_success: '',
    message_error: ''
  },
  methods: {
    save: function () {
      if (body_con.id != '') {
        $.ajax({
          url:'api/request',
          type:'PUT',
          data: {
            'year': body_con.year,
            'items': body_con.articles,
            'id': body_con.id
          },
          timeout: 30000,
          error: function (data) {
            send_application.message_success = '';
            send_application.message_error = 'Сохранение не удалось';
          },
          success:function (res) {
            send_application.message_success = 'Сохранение прошло успешно';
            send_application.message_error = '';
          }
        });
      }else {
        $.ajax({
          url:'api/request',
          type:'POST',
          data: {
            'year': body_con.year,
            'items': body_con.articles
          },
          timeout: 30000,
          error: function (data) {
            send_application.message_success = '';
            send_application.message_error = 'Сохранение не удалось';
          },
          success:function (res) {
            send_application.message_success = 'Сохранение прошло успешно';
            send_application.message_error = '';
            location.replace("/");
          }
        });
      }

    }
  }
});

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
    ]
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
          body_con.time_to_load2();
        }
      });
    },

    time_to_load2: function () {
      var getval = getUrlVars();
      if (getval['id']) {
        this.id = getval['id']
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
            alert(JSON.stringify(res));
            body_con.time_to_index(res.data);
          }
        });
      }
      else {
        var date = new Date();
        this.year = date.getUTCFullYear() + 1;
        this.name_maker = 'Вася';
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
                    periods: periods_item
                  }
                );
              }
              body_con.articles.push(
                {
                  id: res.data[i].id,
                  name: res.data[i].name,
                  table_show: false,
                  items: products
                }
              );
            }
          }
        });
        this.isload = false;
        this.loadtrue = true;
        this.tobe = true;
        this.loaderror = false;
      }
    },

    time_to_index: function (data) {
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
            //должно быть заполнение из заявки
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
                  periods: periods_item
                }
              );
            }
            body_con.articles.push(
              {
                id: res.data[i].id,
                name: res.data[i].name,
                table_show: false,
                items: products
              }
            );
          }
        }
      });
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
      send_application.name = this.name_estimate;
      send_application.year = this.year;
      $('#send_application').modal('open');
    }

  }
});

//Окно созранения сметы
var send_application = new Vue({
  el: '#send_application',
  data:{
    name: '',
    year: '',
    message_success: '',
    message_error: ''
  },
  methods: {
    save: function () {
      if (this.id != '') {
        $.ajax({
          url:'api/request',
          type:'PUT',
          data: {
            'id': body_con.id,
            'name': body_con.name_request,
            'year': body_con.year,
            'cost-item': body_con.articles
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
            'name': body_con.name_request,
            'year': body_con.year,
            'cost-item': body_con.articles
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
      }

    }
  }
});

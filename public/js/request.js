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
    articles: [ //статьи расходов
      {id: '10', name:'Мебель', table_show: false, items:[
          {name: 'Биван', id: '66', //товарные позиции
          january: '2',
          february: '2',
          march: '2',
          april: '2',
          may: '2',
          june: '2',
          july: '2',
          august: '2',
          september: '2',
          october: '2',
          november: '2',
          december: '2'}
        ]
      },
      {id: '11', name:'Попаболь', table_show: false, items:[
          {name: 'БОЛЬ', id: '666',
          january: '2',
          february: '2',
          march: '2',
          april: '2',
          may: '2',
          june: '2',
          july: '2',
          august: '2',
          september: '2',
          october: '2',
          november: '2',
          december: '2'},
          {name: 'ЕЩЁ БОЛЬ', id: '13',
          january: '2',
          february: '2',
          march: '2',
          april: '2',
          may: '2',
          june: '2',
          july: '2',
          august: '2',
          september: '2',
          october: '2',
          november: '2',
          december: '2'}
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
      var getval = getUrlVars();
      var regexp = /^[а-яa-z0-9_-]{1,20}$/i;
      this.tobe = false;
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
            body_con.isload = false;
            body_con.loadtrue = true;
            body_con.loaderror = false;
          }
        });
        $.ajax({
          /*список всех статей и их товарный позиций*/
          url:'api/cost-item',
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.error_art = true;
            body_con.message_art = 'Пожалуйста перезагрузите страницу';
          },
          success:function (res) {
            //Тут нужно обработать список дополнительных расходов

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
            //Тут нужно обработать список дополнительных расходов
            alert(JSON.stringify(res));
          }
        });
        this.isload = false;
        this.loadtrue = true;
        this.tobe = true;
        this.loaderror = false;
      }
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

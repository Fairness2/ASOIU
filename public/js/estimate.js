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
    isload: true, //если страница загружается
    loadtrue: false, //усли страница загрузилось удачно
    loaderror: false, //если страница загрузилась не удачно
    tobe: true, //показать кнопки
    table: false, //Показать сводную таблицу
    request: false, //показать заявки
    costs: false, //показать дополнительные расходы
    error_request: false, //ошибка с загрузкой заявок
    error_additional: false, //ошибка с загрузкой доп расходов
    error_article: false, //ошибка с загрузкой статей расходов
    message_error: '', //сообщени о ошибке загрузки страницы
    name_estimate: '', //название сметы
    year: '', //год сметы
    cfo: '', //цфо
    name_maker: '', //создатель
    creation_date: '', //дата создание
    name_changer: '', //изменитель
    change_date: '', //дата изменения
    message_request: '', //сообщени о заявок
    message_article: '', //Сообщение статей расходов
    message_additional: '', //Сообщение доп расходов
    id: '',
    articles: [ //статьи расходов
      {id: '10', name:'Мебель', table_show: false, items:[
          {name: 'Биван', id: '66', //товарные позиции
          january: '2000', //Это стоимость
          february: '2000',
          march: '2000',
          april: '2000',
          may: '2000',
          june: '20000',
          july: '20000',
          august: '2000',
          september: '20000',
          october: '20000',
          november: '20000',
          december: '2000'}
        ]
      },
      {id: '11', name:'Попаболь', table_show: false, items:[
          {name: 'БОЛЬ', id: '666',
          january: '2000',
          february: '2000',
          march: '2000',
          april: '2000',
          may: '2000',
          june: '2000',
          july: '2000',
          august: '2000',
          september: '2000',
          october: '2000',
          november: '2000',
          december: '2000'},
          {name: 'ЕЩЁ БОЛЬ', id: '13',
          january: '2000',
          february: '2000',
          march: '2000',
          april: '2000',
          may: '2000',
          june: '2000',
          july: '2000',
          august: '2000',
          september: '2000',
          october: '2000',
          november: '2000',
          december: '2000'}
        ]
      }
    ],
    requests: [ //список заявок
      {id:24432, name:'Вася', employee: 'Васильев остров', ischeck: false},
      {id:3464573, name:'Гена', employee: 'Генадьевск', ischeck: true}
    ]
  },

  methods:{
    time_to_load: function () { //загрузка страницы
      this.isload = true;
      this.loadtrue = false;
      this.loaderror = false;
      var getval = getUrlVars();
      var regexp = /^[а-яa-z0-9_-]{1,20}$/i;
      //this.tobe = false;
      if (getval['id']) {
        this.id = getval['id'];
        $.ajax({
          /*Тут нужно список заявок, с пометкой, какие включены, сведения о
          дополнительных расходах, и сведения о смете*/
          url:'api/estimate/' + body_con.id,
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.isload = false;
            body_con.loadtrue = false;
            body_con.loaderror = true;
            body_con.message_error = 'Ошибка';
          },
          success:function (res) {
            //Тут нужно получить данные сметы и обработать, нужны
            body_con.isload = false;
            body_con.loadtrue = true;
            body_con.loaderror = false;
          }
        });
        $.ajax({
          /*список дополнительных расходов*/
          url:'api/cost-item?frc=',
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.error_article = true;
            body_con.message_article = 'Пожалуйста перезагрузите страницу';
          },
          success:function (res) {
            //Тут нужно обработать список статей расходов

          }
        });
      }
      else if (getval['name'] && regexp.test(getval['name']) && getval['cfo']) {

        var date = new Date();
        this.year = date.getUTCFullYear() + 1;
        this.creation_date = date.getUTCDate() + "." + date.getUTCMonth() + "." + date.getUTCFullYear();
        this.change_date =  date.getUTCDate() + "." + date.getUTCMonth() + "." + date.getUTCFullYear();
        this.name_estimate = getval['name'];

        this.name_maker = side_nav.name;
        this.name_changer = side_nav.name;
        this.cfo = getval['cfo']; //Пока так

        $.ajax({
          /*список дополнительных расходов*/
          url:'api/cost-item?with=products&frcId=' + body_con.cfo,
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.error_article = true;
            body_con.message_article = 'Пожалуйста перезагрузите страницу';
          },
          success:function (res) {
            //Тут нужно обработать список статей расходов
            body_con.articles = [];
            var products = [];
            for (var i = 0; i < res.data.length; i++) {
              products = [];
              for (var j = 0; j < res.data[i].products.length; j++) {
                products.push(
                  {
                    id: res.data[i].products[j].id,
                    price: res.data[i].products[j].price,
                    name: res.data[i].products[j].name,
                    january: '0',
                    february: '0',
                    march: '0',
                    april: '0',
                    may: '0',
                    june: '0',
                    july: '0',
                    august: '0',
                    september: '0',
                    october: '0',
                    november: '0',
                    december: '0'
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


        $.ajax({
          /*список всех заявок*/
          url:'api/request?limit=all',
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.error_request = true;
            body_con.message_request = 'Пожалучйста перезагрузите страницу';
          },
          success:function (res) {
            //Тут нужно обработать список дополнительных расходов
            body_con.requests = [];
            for (var i = 0; i < res.data.length; i++) {
              body_con.requests.push(
                {
                  id: res.data[i].id,
                  name: res.data[i].number,
                  employee: res.data[i].requester.fullName,
                  ischeck: false
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
      else {
        this.isload = false;
        this.loadtrue = false;
        this.loaderror = true;
        this.message_error = 'Ошибка!';
      }
    },

    //Показать товарные позиции по статье
    show: function (id) {
      for (var i = 0; i < this.articles.length; i++)
      {
        this.articles[i].table_show = false;
        if(this.articles[i].id == id)
        {
          this.articles[i].table_show = true;
        }
      }
    },

    //Показать секцию таблица, заявки или допюрасходы
    show_section: function (section) {
      if (section == 1) {
        this.table = true;
        this.request = false;
        this.costs = false;
      }
      else if (section == 2) {
        this.table = false;
        this.request = true;
        this.costs = false;
      }
      else if (section == 3) {
        this.table = false;
        this.request = false;
        this.costs = true;
      }
    },

    //Добавить или удалить данные заявки из сметы
    check_request: function (id) {
      $.ajax({
        url:'api/request/' + id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          $('#errrors').modal('open');
        },
        success:function (res) {
          //Тут нужно получить данные заявки и обработать
          var flag = false;
          for (var i = 0; i < body_con.requests.length; i++) {
            if (body_con.requests[i].id == id) {
              flag = body_con.requests[i].ischeck;
              break;
            }
          }
          if (flag) {
            //тут если выбрана заявка
          }else {
            //тут если убрана
          }
        }
      });      
    },

    //Кнопка сохранить
    save_app: function () {
      save_application.name = this.name_estimate;
      save_application.year = this.year;
      $('#save_application').modal('open');
    },

    //Кнопка сохранить
    send_app: function () {
      send_application.name = this.name_estimate;
      send_application.year = this.year;
      $('#send_application').modal('open');
    },

    //Кнопка сохранить
    del_app: function () {
      del_application.name = this.name_estimate;
      del_application.year = this.year;
      $('#del_application').modal('open');
    }
  }
});

var errors = new Vue({
  el: '#errors',
  data:{
    error_text: ''
  }
});

//Окно созранения сметы
var save_application = new Vue({
  el: '#save_application',
  data:{
    name: '',
    year: '',
    message_success: '',
    message_error: ''
  },
  methods: {
    save: function () {
      var requests = [];

      for (var i = 0; i < body_con.requests.length; i++) {
        if (body_con.requests[i].ischeck) {
          requests.push(body_con.requests[i].id);
        }
      }

      $.ajax({
        url:'api/estimate',
        type:'POST',
        data: {
          'name': body_con.name_estimate,
          'year': body_con.year,
          'frcId': body_con.cfo,
          'requestorId': body_con.name_maker,
          //'creation_date': body_con.creation_date,
          //'name_changer': body_con.name_changer,
          //'change_date': body_con.change_date,
          //'additional_articles': body_con.additional_articles,
          'requests': requests},
        timeout: 30000,
        error: function (data) {
          save_application.message_success = '';
          save_application.message_error = 'Сохранение не удалось';
        },
        success:function (res) {
          save_application.message_success = 'Сохранение прошло успешно';
          save_application.message_error = '';
        }
      });
    }
  }
});

//Окно отправки сметы
var send_application = new Vue({
  el: '#send_application',
  data:{
    name: '',
    year: '',
    message_success: '',
    message_error: ''
  },
  methods: {
    send: function () {
      $.ajax({
        url:'api/estimate_send',
        type:'POST',
        data: {
          'name': body_con.name_estimate,
          'year': body_con.year,
          'frcId': body_con.cfo,
          'requestorId': body_con.name_maker,
          //'creation_date': body_con.creation_date,
          //'name_changer': body_con.name_changer,
          //'change_date': body_con.change_date
          },
        timeout: 30000,
        error: function (data) {
          save_application.message_success = '';
          save_application.message_error = 'При отправке произошла ошибка';
        },
        success:function (res) {
          save_application.message_success = 'Отправка прошла успешно';
          save_application.message_error = '';
          location.replace("/");
        }
      });
    }
  }
});

//Окно удаления сметы
var del_application = new Vue({
  el: '#del_application',
  data:{
    name: '',
    year: '',
    message_success: '',
    message_error: ''
  },
  methods: {
    deleted: function () {
      $.ajax({
        url:'api/estimate',
        type:'DELETE',
        data: {
          'name': body_con.name_estimate,
          'year': body_con.year,
          'cfo': body_con.cfo,
          'name_maker': body_con.name_maker,
          'creation_date': body_con.creation_date,
          'name_changer': body_con.name_changer,
          'change_date': body_con.change_date
          },
        timeout: 30000,
        error: function (data) {
          save_application.message_success = '';
          save_application.message_error = 'При удалении произошла ошибка';
        },
        success:function (res) {
          save_application.message_success = 'Удаление прошло успешно';
          save_application.message_error = '';
          location.replace("/");
        }
      });
    }
  }
});

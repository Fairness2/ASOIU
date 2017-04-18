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
    estimate: false, //показать сметы цфо
    error_estimate: false, //ошибка с загрузкой смет цфо
    error_article: false, //ошибка с загрузкой статей расходов
    message_error: '', //сообщени о ошибке загрузки страницы
    name_estimate: '', //название сметы
    year: '', //год сметы
    name_maker: '', //создатель
    creation_date: '', //дата создание
    name_changer: '', //изменитель
    change_date: '', //дата изменения
    message_estimate: '', //сообщени о заявок
    message_additional: '', //Сообщение доп расходов
    message_article: '', //Сообщение статей расходов
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
    estimates: [ //список смет цфо
      {id:24432, name:'Вася', cfo: 'Васильев остров', ischeck: false, num: '10'},
      {id:3464573, name:'Гена', cfo: 'Генадьевск', ischeck: true, num: '10'}
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
        $.ajax({
          /*Тут нужно список заявок, с пометкой, какие включены, сведения о
          дополнительных расходах, и сведения о смете*/
          url:'api/estimate_company?id=' + getval['id'],
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
          url:'api/article',
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
      else if (getval['name'] && regexp.test(getval['name'])) {

        var date = new Date();
        this.year = date.getUTCFullYear() + 1;
        this.creation_date = date.getUTCDate() + "." + date.getUTCMonth() + "." + date.getUTCFullYear();
        this.change_date =  date.getUTCDate() + "." + date.getUTCMonth() + "." + date.getUTCFullYear();
        this.name_estimate = getval['name'];

        this.name_maker = side_nav.name;
        this.name_changer = side_nav.name; //Пока так

        $.ajax({
          /*список всех заявок*/
          url:'api/estimate_list',
          type:'GET',
          timeout: 30000,
          error: function (data) {
            body_con.error_estimate = true;
            body_con.message_estimate = 'Пожалучйста перезагрузите страницу';
          },
          success:function (res) {
            //Тут нужно обработать список смет цфо

          }
        });
        $.ajax({
          /*список дополнительных расходов*/
          url:'api/article',
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

    //Показать секцию таблица или сметы цфо
    show_section: function (section) {
      if (section == 1) {
        this.table = true;
        this.estimate = false;
      }
      else if (section == 2) {
        this.table = false;
        this.estimate = true;
      }
    },

    //Добавить или удалить данные заявки из сметы
    check_estimate: function (id) {
      $.ajax({
        url:'api/estimate?id=' + id,
        type:'GET',
        timeout: 30000,
        error: function (data) {
          $('#errrors').modal('open');
        },
        success:function (res) {
          //Тут нужно получить данные заявки и обработать
          var flag = false;
          for (var i = 0; i < body_con.estimates.length; i++) {
            if (body_con.estimates[i].id == id) {
              flag = body_con.estimates[i].ischeck;
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
      alert ('Дарова');
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
      var estimates = [];

      for (var i = 0; i < body_con.estimates.length; i++) {
        if (body_con.estimates[i].ischeck) {
          estimates.push(body_con.estimates[i].id);
        }
      }

      $.ajax({
        url:'api/estimate_company',
        type:'PUT',
        data: {
          'name': body_con.name_estimate,
          'year': body_con.year,
          'name_maker': body_con.name_maker,
          'creation_date': body_con.creation_date,
          'name_changer': body_con.name_changer,
          'change_date': body_con.change_date,
          'estimates': estimates},
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
        url:'api/estimate_company_send',
        type:'PUT',
        data: {
          'name': body_con.name_estimate,
          'year': body_con.year,
          'name_maker': body_con.name_maker,
          'creation_date': body_con.creation_date,
          'name_changer': body_con.name_changer,
          'change_date': body_con.change_date
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
        url:'api/estimate_company',
        type:'DELETE',
        data: {
          'name': body_con.name_estimate,
          'year': body_con.year,
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

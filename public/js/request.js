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
    isload: true,
    loadtrue: false,
    loaderror: false,
    tobe: true,
    load_table: false,
    table_show: false,
    message_error: 'Вот такие пироги',
    name_request: '',
    year: '',
    department: '',
    name_maker: '',
    articles: [
      {id: '10', name:'Мебель', table_show: false, items:[
          {name: 'Биван', id: '66',
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
          {name: 'БОЛЬ', id: '66',
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
    time_to_load: function () {
      this.isload = true;
      this.loadtrue = false;
      this.loaderror = false;
      var getval = getUrlVars();
      var regexp = /^[а-яa-z0-9_-]{1,20}$/i;
      this.tobe = false;
      if (getval['id']) {
        $.ajax({
          url:'api/request?id=' + getval['id'],
          type:'GET',
          //data: {'year': year},
          /*dataType: "json",
          jsonp: false,*/
          timeout: 30000,
          error: function (data) {
            body_con.isload = false;
            body_con.loadtrue = false;
            body_con.loaderror = true;
            body_con.message_error = 'Ошибка';
            //JSON.parse(data)
          },
          /*statusCode:{
            400: function () {
              loginin.isload = false;
              loginin.message = 'Вход уже выполнен';
            },
            500: function functionName() {
              loginin.isload = false;
              loginin.message = 'Ошибка входа';
            }
          },*/
          success:function (res) {
            //Тут нужно получить данные заявки и обработать
            body_con.isload = false;
            body_con.loadtrue = true;
            body_con.loaderror = false;
          }
        });
      }
      else if (getval['name'] && regexp.test(getval['name'])) {

        var date = new Date();
        this.year = date.getFullYear() + 1;
        this.name_request = getval['name'];
        this.name_maker = side_nav.name;
        this.department = side_nav.department;

        this.isload = false;
        this.loadtrue = true;
        this.tobe = true;
        this.loaderror = false;
      }
      else {
        this.isload = false;
        this.loadtrue = false;
        this.loaderror = true;
        this.message_error = 'Ошибка!' + getval['name'];
      }
    },

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

    values: function (value, aid, id, month) {
      alert(value + " " + aid + " " + id + " " + month);
    }
  }
});

const Hapi = require('@hapi/hapi');
const Routes = require('./routes');
const Sequelize = require('sequelize')
config ={
    db_name:'where_is_your_motivation_db',
    db:["where_is_your_motivation_db", "root", "",{
        dialect: "mysql",
        host: "localhost"
    }]
}
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

//where_is_your_motivation_db
await server.register([
    // hapiBoomDecorators,
    // Добавляем это
    {
      plugin: require('hapi-sequelizejs'),
      options: [
        {
          name: config.db_name, 
          models: [__dirname + '/models/*.js'], // Путь к моделькам
          //ignoredModels: [__dirname + '/server/models/**/*.js'], // Можем некоторые модельки заигнорить
          sequelize: new Sequelize(...config.db), // Инициализируем обычный секьюлайз и передаём его параметром
          sync: true, // Синхронизировать/нет модели с реальной бд
          forceSync: false, // Если тру, то таблицы будут дропнуты перед синхронизацией, остарожно
        },
      ],
    }
    // Конец
  ]);
    server.route([...Routes]);
    server.ext({
        type: 'onRequest',
        method: async function (request, h) {
          request.server.config = Object.assign({}, config);
          return h.continue;
        }
      });
    await server.start();
    console.log('Server running on %s', server.info.uri);
    return server;
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
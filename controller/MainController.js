
MainController = [
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            const Person = request.getModel(request.server.config.db_name, 'persons');
            let data = await Person.findAll();
            return {data};
        }
    },
    {
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return 'About page';
        }
    }
];

module.exports = {
    MainController
}
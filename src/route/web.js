
var workController= require('../controllers/work-controller')

let initWebRoutes = async (app) => {
    app.get('/',workController.getInforUser);
    app.post('/search',workController.search);
    app.get('/workResults',workController.workResults);
}  
module.exports = initWebRoutes;

var findCompanyController= require('../controller/findCompany')

let initWebRoutes = async (app) => {
    app.get('/',findCompanyController.admin);
    app.post('/search',findCompanyController.search);
}  
module.exports = initWebRoutes;
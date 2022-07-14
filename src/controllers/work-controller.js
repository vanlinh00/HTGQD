var workService = require('../services/work-service')
let getInforUser = async function (req, res) {
   res.render('user/inforUser');
}
let search = async function (req, res) {
   let degree = 1;
   let inputDegree = req.body.degree;
   if (inputDegree.localeCompare("Bằng Đại Học") == 0) {
      degree = 3;
   }
   if (inputDegree.localeCompare("Bằng Cao Đẳng") == 0) {
      degree = 2;
   }
   if (inputDegree.localeCompare("Bằng Cấp 3") == 0) {
      degree = 1;
   }

   var coordsUser = {
      latitudeUser: parseFloat(req.body.latitudeUser),
      longitudeUser: parseFloat(req.body.longitudeUser)
   }
   var user = {
      "coordsUser": coordsUser,
      "degreeUser": degree,
      "xpUser": parseFloat(req.body.numberOfYearOfXp),
      "salaryUser": parseFloat(req.body.salary),
   }

   // 21.02533908583286, 105.78495853482494
   coordsCompany = {
      latitudeCompany: 21.02533908583286,
      longitudeCompany: 105.78495853482494
   }


   // console.log(user);

   var getAllWorkOfUser = await workService.getAllWork(user);
   var chooseCompany= await workService.chooseCompany();

   res.render('user/searchResults', { getAllWorkOfUser,chooseCompany });
}

let workResults = async function (req, res) {

   res.render('user/workResults');
}

module.exports = {
   getInforUser: getInforUser,
   search: search,
   workResults: workResults,
}
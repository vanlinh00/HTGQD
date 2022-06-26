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
   var user = {
      "addressUser": req.body.address,
      "degreeUser": degree.toString(),
      "xpUser": req.body.numberOfYearOfXp,
      "salaryUser": req.body.salary,
   }
   var getAllWorkOfUser = await workService.getAllWork(user);
  // console.log(getAllWorkOfUser);
   res.render('user/searchResults', { getAllWorkOfUser });
}

let workResults = async function (req, res) {

   res.render('user/workResults');
}

module.exports = {
   getInforUser: getInforUser,
   search: search,
   workResults:workResults,
}
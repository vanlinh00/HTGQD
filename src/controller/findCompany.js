
var models= require('../models/inforCompany')
let admin = function(req,res) {
   res.render('user/inforUser');
}
let search = function(req,res){
   // console.log(req.body);
   var listDiemTieuChi=[];
   res.render('user/searchResults',{listDiemTieuChi});
}
module.exports={
    admin:admin,
    search:search
}
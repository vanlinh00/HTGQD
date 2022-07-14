var workModel = require('../models/work-model')

function getCoordsDistance(coords1, coords2) {
    // earth

    var R = 6371, // km
        lat1 = parseFloat(coords1.lat),
        lat2 = parseFloat(coords2.lat),
        lon1 = parseFloat(coords1.lng),
        lon2 = parseFloat(coords2.lng);

    // deg2rad
    lat1 = (lat1 / 180) * Math.PI;
    lat2 = (lat2 / 180) * Math.PI;

    // khinh độ
    lon1 = (lon1 / 180) * Math.PI;
    lon2 = (lon2 / 180) * Math.PI;

    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return Math.round(d * 1000);

}

let chooseCompanyBySstart = "";
let chooseCompanyBySminus = "";
let chooseCompanyByCstart = "";


let getAllWork = async (user) => {
    return new Promise((async (resolve, reject) => {
        try {

            var getAllWork = [];
            var getAllWorkBase = await workModel.getAllWorkWithCompany();

            // calculate distance
            for (let i = 0; i < getAllWorkBase.length; i++) {

                coordsUSer = {
                    lat: user.coordsUser.latitudeUser,
                    lng: user.coordsUser.longitudeUser
                }

                coordsCompany = {
                    lat: getAllWorkBase[i].latitude_company,
                    lng: getAllWorkBase[i].longitude_company
                }

                var distanceCompanyAndUser = await getCoordsDistance(coordsUSer, coordsCompany);

                // console.log(distanceCompanyAndUser);

                var conventionDistance = null;

                if (distanceCompanyAndUser <= 2000) {
                    conventionDistance = 4;
                }
                if (2000 < distanceCompanyAndUser && distanceCompanyAndUser <= 7000) {
                    conventionDistance = 3;
                }
                if (7000 < distanceCompanyAndUser && distanceCompanyAndUser <= 10000) {
                    conventionDistance = 2;
                }
                if (10000 < distanceCompanyAndUser && distanceCompanyAndUser <= 15000) {
                    conventionDistance = 1;
                }
                if (distanceCompanyAndUser > 15000) {
                    conventionDistance = 0;
                }

                var work = {
                    id: getAllWorkBase[i].id,
                    name: getAllWorkBase[i].name,
                    salary: getAllWorkBase[i].salary,
                    num_of_years_of_xp: getAllWorkBase[i].num_of_years_of_xp,
                    degree_required: getAllWorkBase[i].degree_required,
                    id_company: getAllWorkBase[i].id_company,
                    name_company: getAllWorkBase[i].name_company,
                    rank_company: getAllWorkBase[i].rank_company,
                    distance_company_user: conventionDistance,

                }
                getAllWork.push(work);

            }

            // console.log(getAllWork);

            if (getAllWork != null && getAllWork.length != 0) {

                let maxSalary_fit = 0;
                let maxRank_company = 0;
                let maxNum_of_years_of_xp_fit = 0;
                let maxDegree_fit = 0;
                let maxDistance_company_user = 0;


                //step 1: bang quyet dinh va tim duoc max cua moi criteria
                var listCriteria = [];
                for (let i = 0; i < getAllWork.length; i++) {

                    let salary_fit = (getAllWork[i].salary / user.salaryUser).toFixed(3);
                    if (salary_fit > maxSalary_fit) {
                        maxSalary_fit = salary_fit;
                    }

                    if (getAllWork[i].rank_company > maxRank_company) {
                        maxRank_company = getAllWork[i].rank_company;
                    }

                    let num_of_years_of_xp_fit = (user.xpUser / getAllWork[i].num_of_years_of_xp).toFixed(3);
                    if (num_of_years_of_xp_fit > maxNum_of_years_of_xp_fit) {
                        maxNum_of_years_of_xp_fit = num_of_years_of_xp_fit;
                    }

                    let degree_fit = (user.degreeUser / getAllWork[i].degree_required).toFixed(3);
                    if (degree_fit > maxDegree_fit) {
                        maxDegree_fit = degree_fit;
                    }

                    maxDistance_company_user = (maxDistance_company_user < getAllWork[i].distance_company_user) ? getAllWork[i].distance_company_user : maxDistance_company_user;
                    // if (maxDistance_company_user < getAllWork[i].distance_company_user) {
                    //     maxDistance_company_user = getAllWork[i].distance_company_user;
                    // }
                    var criteria = {
                        "stt": i + 1,
                        "name_company": getAllWork[i].name_company,
                        "salary_fit": salary_fit,
                        // "address_fit": "chua biet tinh",
                        "rank_company": getAllWork[i].rank_company,
                        "num_of_years_of_xp_fit": num_of_years_of_xp_fit,
                        "degree_fit": degree_fit,
                        "distance_company_user": getAllWork[i].distance_company_user
                    }
                    listCriteria.push(criteria);
                }


                // step 2: chuan hoa va nhan trong so
                var listCriteriaStandardized = [];
                for (let i = 0; i < listCriteria.length; i++) {

                    //let caculsalary_fit=
                    var CriteriaStandardized = {
                        "stt": i + 1,
                        "name_company": listCriteria[i].name_company,
                        "salary_fit": ((listCriteria[i].salary_fit / maxSalary_fit) * 0.3).toFixed(3),
                        //  "address_fit": "chua biet tinh",
                        "rank_company": ((listCriteria[i].rank_company / maxRank_company) * 0.2).toFixed(3),
                        "num_of_years_of_xp_fit": ((listCriteria[i].num_of_years_of_xp_fit / maxNum_of_years_of_xp_fit) * 0.1).toFixed(3),
                        "degree_fit": ((listCriteria[i].degree_fit / maxDegree_fit) * 0.1).toFixed(3),
                        "distance_company_user": ((listCriteria[i].distance_company_user / maxDistance_company_user) * 0.3).toFixed(3),
                    }
                    listCriteriaStandardized.push(CriteriaStandardized);
                }


                let arr2DcompanyAndCriteria = [];

                for (let i = 0; i < listCriteriaStandardized.length; i++) {   // so cong ty 
                    arr2DcompanyAndCriteria[i] = [];                  // moi hang mot arrr 
                }

                console.log(arr2DcompanyAndCriteria);

                let countCriteria = 5;   //tuong ung voi 5 tieu chi
                for (let i = 0; i < listCriteriaStandardized.length; i++) {
                    for (let j = 0; j < countCriteria; j++) {  // 4 tuong ung voi 4 tieu chi
                        if (j == 0) {
                            arr2DcompanyAndCriteria[i][j] = listCriteriaStandardized[i].salary_fit;
                        }
                        if (j == 1) {
                            arr2DcompanyAndCriteria[i][j] = listCriteriaStandardized[i].rank_company;
                        }
                        if (j == 2) {
                            arr2DcompanyAndCriteria[i][j] = listCriteriaStandardized[i].num_of_years_of_xp_fit;
                        }
                        if (j == 3) {
                            arr2DcompanyAndCriteria[i][j] = listCriteriaStandardized[i].degree_fit;
                        }
                        if (j == 4) {
                            arr2DcompanyAndCriteria[i][j] = listCriteriaStandardized[i].distance_company_user;
                        }
                    }
                }

                console.log("\n");
                console.log("step 2: chuan hoa va nhan trong so");
                console.log(arr2DcompanyAndCriteria);


                // step 3: tim A* and A-
                var listAstar = [];
                var ListAminus = [];

                maxSalary_fit = 0;
                maxRank_company = 0;
                maxNum_of_years_of_xp_fit = 0;
                maxDegree_fit = 0;
                maxDistance_company_user = 0;


                let minSalary_fit = listCriteriaStandardized[0].salary_fit;
                let minRank_company = listCriteriaStandardized[0].rank_company;
                let minNum_of_years_of_xp_fit = listCriteriaStandardized[0].num_of_years_of_xp_fit;
                let minDegree_fit = listCriteriaStandardized[0].degree_fit;
                let minDistance_company_user = listCriteriaStandardized[0].distance_company_user;

                for (let i = 0; i < listCriteriaStandardized.length; i++) {

                    // tim list A*

                    if (listCriteriaStandardized[i].salary_fit > maxSalary_fit) {
                        maxSalary_fit = listCriteriaStandardized[i].salary_fit;
                    }

                    if (listCriteriaStandardized[i].rank_company > maxRank_company) {
                        maxRank_company = listCriteriaStandardized[i].rank_company;
                    }

                    if (listCriteriaStandardized[i].num_of_years_of_xp_fit > maxNum_of_years_of_xp_fit) {
                        maxNum_of_years_of_xp_fit = listCriteriaStandardized[i].num_of_years_of_xp_fit;
                    }

                    if (listCriteriaStandardized[i].degree_fit > maxDegree_fit) {
                        maxDegree_fit = listCriteriaStandardized[i].degree_fit;
                    }

                    if (listCriteriaStandardized[i].distance_company_user > maxDistance_company_user) {
                        maxDistance_company_user = listCriteriaStandardized[i].distance_company_user;
                    }


                    // tim list A-

                    if (listCriteriaStandardized[i].salary_fit < minSalary_fit) {
                        minSalary_fit = listCriteriaStandardized[i].salary_fit;
                    }

                    if (listCriteriaStandardized[i].rank_company < minRank_company) {
                        minRank_company = listCriteriaStandardized[i].rank_company;
                    }

                    if (listCriteriaStandardized[i].num_of_years_of_xp_fit < minNum_of_years_of_xp_fit) {
                        minNum_of_years_of_xp_fit = listCriteriaStandardized[i].num_of_years_of_xp_fit;
                    }

                    if (listCriteriaStandardized[i].degree_fit < minDegree_fit) {
                        minDegree_fit = listCriteriaStandardized[i].degree_fit;
                    }

                    if (listCriteriaStandardized[i].distance_company_user < minDistance_company_user) {
                        minDistance_company_user = listCriteriaStandardized[i].distance_company_user;
                    }

                }

                listAstar.push(maxSalary_fit);
                listAstar.push(maxRank_company);
                listAstar.push(maxNum_of_years_of_xp_fit);
                listAstar.push(maxDegree_fit);
                listAstar.push(maxDistance_company_user);


                ListAminus.push(minSalary_fit);
                ListAminus.push(minRank_company);
                ListAminus.push(minNum_of_years_of_xp_fit);
                ListAminus.push(minDegree_fit);
                ListAminus.push(minDistance_company_user);

                console.log("\n");
                console.log("step 3: tim A* and A-")
                console.log(listAstar);
                console.log(ListAminus);

                // step 4: tim s* va s-


                /*
                 // test theo slide cua thay chuong page (55/116) da dung
                 
                  var testAstart = [0.1333, 0.0917, 0.1027, 0.0806, 0.0865];
                  var testS=[0.1314,0.0711,0.0925,0.0564,0.0346];
  
                  let num =0;
                  for(let i=0;i<testAstart.length;i++){
                      let minus =testS[i]-testAstart[i];
                      num += Math.pow(minus, 2);
                  }
                  console.log(Math.pow(num, 1/2));
                  */

                var sStar = [];
                var sMinus = [];

                for (let i = 0; i < arr2DcompanyAndCriteria.length; i++) {
                    var sumStart = 0;
                    var sumSminus = 0;
                    for (let j = 0; j < arr2DcompanyAndCriteria[i].length; j++) {

                        var minus2ValueMax = arr2DcompanyAndCriteria[i][j] - listAstar[j];
                        sumStart += Math.pow(minus2ValueMax, 2);

                        var minus2ValueMin = arr2DcompanyAndCriteria[i][j] - ListAminus[j];
                        sumSminus += Math.pow(minus2ValueMin, 2);

                    }

                    sStar.push((Math.pow(sumStart, 1 / 2)).toFixed(3));

                    sMinus.push((Math.pow(sumSminus, 1 / 2)).toFixed(3));

                    sumStart = 0;
                    sumSminus = 0;

                }

                console.log("\n");
                console.log("step 4: tim S* and S- ");
                console.log(sStar);
                console.log(sMinus);

                var cStars = [];

                for (let i = 0; i < sStar.length; i++) {

                    let a = (sMinus[i] / (parseFloat(sStar[i]) + parseFloat(sMinus[i]))).toFixed(3);
                    cStars.push(a);
                }


                console.log("\n");
                console.log("step 5: tim C* ");
                console.log(cStars);

                // cha ve gia tri de in ra table ma thay mong muon
                let minSstart = sStar[0];
                // let chooseCompanyBySstart = "";

                let maxSminus = 0;
                //   let chooseCompanyBySminus = "";

                let maxCstart = 0;
                //  let chooseCompanyByCstart = "";

                var listDataResult = [];
                for (let i = 0; i < listCriteriaStandardized.length; i++) {

                    var datResult = {
                        stt: listCriteriaStandardized[i].stt,
                        name_company: listCriteriaStandardized[i].name_company,
                        salary_fit: listCriteriaStandardized[i].salary_fit,
                        rank_company: listCriteriaStandardized[i].rank_company,
                        num_of_years_of_xp_fit: listCriteriaStandardized[i].num_of_years_of_xp_fit,
                        degree_fit: listCriteriaStandardized[i].degree_fit,
                        distance_company_user: listCriteriaStandardized[i].distance_company_user,
                        sStart_Of_Company: sStar[i],
                        sMinus_Of_Company: sMinus[i],
                        cStars_Of_Company: cStars[i],
                    }
                    if (minSstart > sStar[i]) {
                        minSstart = sStar[i];
                        chooseCompanyBySstart = listCriteriaStandardized[i].name_company;
                    }

                    if (maxSminus < sMinus[i]) {
                        maxSminus = sMinus[i];
                        chooseCompanyBySminus = listCriteriaStandardized[i].name_company;
                    }
                    if (maxCstart < cStars[i]) {
                        maxCstart = cStars[i];
                        chooseCompanyByCstart = listCriteriaStandardized[i].name_company;
                    }


                    listDataResult.push(datResult);

                }


                listAstar.push(maxSalary_fit);
                listAstar.push(maxRank_company);
                listAstar.push(maxNum_of_years_of_xp_fit);
                listAstar.push(maxDegree_fit);
                listAstar.push(maxDistance_company_user);

                // add A* and A-

                var dataAstart = {
                    stt: listCriteriaStandardized.length + 1,
                    name_company: "A*",
                    salary_fit: listAstar[0],
                    rank_company: listAstar[1],
                    num_of_years_of_xp_fit: listAstar[2],
                    degree_fit: listAstar[3],
                    distance_company_user: listAstar[4],
                }
                listDataResult.push(dataAstart);

                var dataAminus = {
                    stt: listCriteriaStandardized.length + 2,
                    name_company: "A-",
                    salary_fit: ListAminus[0],
                    rank_company: ListAminus[1],
                    num_of_years_of_xp_fit: ListAminus[2],
                    degree_fit: ListAminus[3],
                    distance_company_user: ListAminus[4],
                }
                listDataResult.push(dataAminus);


                //  choose by Sstart and Cstart

                //    let chooseCompanyBySstart = "";

                // let maxSminus = 0;
                // let chooseCompanyBySminus = "";

                // let maxCstart = 0;
                // let chooseCompanyByCstart = "";

                resolve(listDataResult);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}
let chooseCompany = () => {

    var dataChooseComp = {
        chooseCompanyBySstart: chooseCompanyBySstart,
        chooseCompanyBySminus: chooseCompanyBySminus,
        chooseCompanyByCstart: chooseCompanyByCstart,
    }
    return dataChooseComp;
}

module.exports = {
    getAllWork: getAllWork,
    chooseCompany:chooseCompany,
}

var workModel = require('../models/work-model')

let getAllWork = async (user) => {
    return new Promise((async (resolve, reject) => {
        try {
            var getAllWork = await workModel.getAllWorkWithCompany();
            if (getAllWork != null) {

                let maxSalary_fit = 0;
                let maxRank_company = 0;
                let maxNum_of_years_of_xp_fit = 0;
                let maxDegree_fit = 0;

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
                    var criteria = {
                        "stt": i + 1,
                        "name_company": getAllWork[i].name_company,
                        "salary_fit": salary_fit,
                        "address_fit": "chua biet tinh",
                        "rank_company": getAllWork[i].rank_company,
                        "num_of_years_of_xp_fit": num_of_years_of_xp_fit,
                        "degree_fit": degree_fit
                    }
                    listCriteria.push(criteria);
                }


                // step 2: chuan hoa va nhan trong so
                var listCriteriaStandardized = [];
                for (let i = 0; i < listCriteria.length; i++) {
                    var CriteriaStandardized = {
                        "stt": i + 1,
                        "name_company": listCriteria[i].name_company,
                        "salary_fit": ((listCriteria[i].salary_fit / maxSalary_fit) * 0.5).toFixed(3),
                        "address_fit": "chua biet tinh",
                        "rank_company": ((listCriteria[i].rank_company / maxRank_company) * 0.2).toFixed(3),
                        "num_of_years_of_xp_fit": ((listCriteria[i].num_of_years_of_xp_fit / maxNum_of_years_of_xp_fit) * 0.2).toFixed(3),
                        "degree_fit": ((listCriteria[i].degree_fit / maxDegree_fit) * 0.1).toFixed(3),
                    }
                    listCriteriaStandardized.push(CriteriaStandardized);
                }

                
                let arr2DcompanyAndCriteria = [];

                for (let i = 0; i < listCriteriaStandardized.length; i++) {
                    for (let j = 0; j < 5; j++) {
                        arr2DcompanyAndCriteria[i] = [];
                    }
                }

                for (let i = 0; i < listCriteriaStandardized.length; i++) {
                    for (let j = 0; j < 4; j++) {
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

                let minSalary_fit = listCriteriaStandardized[0].salary_fit;
                let minRank_company = listCriteriaStandardized[0].rank_company;
                let minNum_of_years_of_xp_fit = listCriteriaStandardized[0].num_of_years_of_xp_fit;
                let minDegree_fit = listCriteriaStandardized[0].degree_fit;

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

                }

                listAstar.push(maxSalary_fit);
                listAstar.push(maxRank_company);
                listAstar.push(maxNum_of_years_of_xp_fit);
                listAstar.push(maxDegree_fit);


                ListAminus.push(minSalary_fit);
                ListAminus.push(minRank_company);
                ListAminus.push(minNum_of_years_of_xp_fit);
                ListAminus.push(minDegree_fit);

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
                        
                        var minus2ValueMax =arr2DcompanyAndCriteria[i][j]-listAstar[j];
                        sumStart += Math.pow(minus2ValueMax,2);

                        var minus2ValueMin= arr2DcompanyAndCriteria[i][j] -ListAminus[j];
                        sumSminus += Math.pow(minus2ValueMin,2);

                    }

                    sStar.push((Math.pow(sumStart,1/2)).toFixed(3));

                    sMinus.push((Math.pow(sumSminus,1/2)).toFixed(3));

                    sumStart=0;
                    sumSminus=0;

                }

                console.log("\n");
                console.log("step 4: tim S* and S- ");
                console.log(sStar);
                console.log(sMinus);

                resolve(listCriteriaStandardized);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

module.exports = {
    getAllWork: getAllWork,
}

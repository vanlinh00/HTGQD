const db = require('../config/databaseConfig');
const company = function () {

}

company.allInfor=()=>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT * FROM inforcompany', (err, res) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(res);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));   
}
module.exports = company;
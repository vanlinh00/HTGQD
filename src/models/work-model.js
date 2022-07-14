const db = require('../config/databaseConfig');
const work = function () {

}
work.getAllWork = () => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT * FROM work', (err, res) => {
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
work.getAllWorkWithCompany = () => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT work.id as id, work.name as name, work.salary as salary ,work. num_of_years_of_xp as num_of_years_of_xp, work.degree_required as degree_required, company.id as id_company, company.name as name_company, company.rank as rank_company, address.latitude_company as latitude_company, address.longitude_company as longitude_company FROM work JOIN company ON work.id_company = company.id JOIN address ON company.id_address = address.id ', (err, res) => {
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
module.exports = work;


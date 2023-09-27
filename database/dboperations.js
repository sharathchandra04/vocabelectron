const { db } = require('./db.js');
const first = () => {
    console.log(db)
    const sql = `CREATE TABLE contacts (
        contact_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );`
    db.run(sql, 
        [],
        function(error, data){
            console.log(error, data);
        }
    );
}
const addcommonwords = (words) => {
    return new Promise((resolve, reject) => {
        let wordsstrllist = [];
        words.forEach(word => {
            wordsstrllist.push(`('${word}')`)
        });
        wordsstrllist = wordsstrllist.join(', ');
        const sql = `INSERT INTO common(word) VALUES ${wordsstrllist};`;
        console.log(sql);
        db.run(sql, 
            [],
            (error, data) => {
                if(error){
                    reject(error)
                }
                resolve(data);
            }
        );  
    });   
}
const getCommon = (words) => {
    return new Promise((resolve, reject) => {
        let wordsstrllist = [];
        words.forEach(word => {
            wordsstrllist.push(`'${word}'`)
        });
        wordsstrllist = wordsstrllist.join(', ');
        const sql = `SELECT * FROM common WHERE word IN (${wordsstrllist});`;
        db.all(sql, 
            [],
            (error, data) => {
                if(error){
                    reject(error)
                }
                data = data.map((d)=>d.word)
                resolve(data);
            }
        );  
    });   
}
module.exports = {
    first,
    addcommonwords,
    getCommon
}
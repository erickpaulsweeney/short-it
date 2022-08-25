const pg = require("pg");

// const dbPool = new pool({
//     user: "postgres",
//     host: "127.0.0.1",
//     database: "shortit",
//     password: "test1234",
//     port: 5432,
// });

const dbPool = new pg.Client(
    "postgres://pvyrepee:MAnjTOY1vGZRiJh4gSdtyOpIf96d99zF@tiny.db.elephantsql.com/pvyrepee"
);

dbPool.connect(function (err) {
    if (err) {
        return console.error("could not connect to postgres", err);
    }
    dbPool.query('SELECT NOW() AS "theTime"', function (err, result) {
        if (err) {
            return console.error("error running query", err);
        }
        console.log(result.rows[0].theTime);
    });
});

module.exports = dbPool;

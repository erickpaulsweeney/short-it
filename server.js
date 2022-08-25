const express = require("express");
const morgan = require("morgan");
const { nanoid } = require("nanoid");
const app = express();

const dbPool = require("./db-config");

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/shortit", (req, res) => {
    console.log(req.body);
    const input = req.body.url;
    const shortened = "https://short-it-mern.herokuapp.com/" + nanoid(6);
    const text =
        "INSERT INTO shortit(original, shortened) VALUES($1, $2) RETURNING *";
    const values = [input, shortened];
    dbPool.query(text, values, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res.rows);
        }
    });
    res.render("notif", { input, shortened });
});

app.get("/:id", async (req, res) => {
    const id = "https://short-it-mern.herokuapp.com/" + req.params.id;
    const query = {
        name: "fetch-item",
        text: "SELECT * FROM shortit WHERE shortened = $1",
        values: [id],
    };
    let result = await dbPool
        .query(query)
        .then((res) => {
            if (!res.rows) {
                return false;
            } else {
                const newQuery = {
                    name: "update-item",
                    text: "UPDATE shortit SET views = views + 1 WHERE shortened = $1",
                    values: [id],
                };
                dbPool
                    .query(newQuery)
                    .then((res) => res)
                    .catch((err) => console.log(err));
                return res.rows[0];
            }
        })
        .catch((err) => console.log(err));
    if (!result) {
        res.render("404");
    } else {
        res.redirect(result.original);
    }
});

app.on("close", async () => {
    await dbPool.end();
});

app.listen(process.env.PORT || 8000);

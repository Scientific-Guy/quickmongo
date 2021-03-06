const { Database } = require("../index");
const db = new Database("mongodb://localhost/test");

db.on("ready", async () => {
    console.log(`Hey, im connected! ${db.toString()}`);
    console.log(await db.all(), `${db}`);

    const mydb = db.table("TEST");
    console.log(await mydb.all(), `${mydb}`);
});

db.on("error", console.error);
db.on("debug", console.log);
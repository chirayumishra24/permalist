import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Dpk@1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", (req, res) => {
  try{ 
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
} catch (err){
  console.log(err);
}
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;

  try{ 
    await db.query("INSERT INTO items (title) VALUES ($1))", [item]);
  //items.push({ title: item });
  res.redirect("/");
}catch (err){
  console.log(err);
}
});

app.post("/edit", (req, res) => {
  const item = req.body.updateItemTitle;
  const id = req.body.updateItemId;
  try{
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item,id]);
    res.redirect("/");
  }catch (err) {
    console.log(err);
  }  }
);

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

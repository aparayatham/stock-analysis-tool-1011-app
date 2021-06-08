const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
// Replace the following with your Atlas connection string
const uri =
  "mongodb+srv://saikr789:3DdY2U1ycupXHUnW@cluster0.pzkng.mongodb.net/stock-analysis-tool-1011?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// The database to use
const dbName = "stock-analysis-tool-1011";

async function run(email, password) {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    const col = db.collection("userdetails");
    const present = await col.findOne({ email: email });
    let status = "";

    if (present == null) {
      status = "account doesnt exists";
    } else {
      const passwordHash = present.password;
      const success = await bcrypt.compare(password, passwordHash);
      if (success) {
        status = "login success";
      } else {
        status = "invalid credentials";
      }
    }
    // await client.close();
    return status;
  } catch (err) {
    // await client.close();
    console.log(err.stack);
    return "error";
  }
}

export default async (req, res, next) => {
  try {
    const email = req.query["email"];
    const password = req.query["password"];
    run(email, password)
      .then((status) => {
        res.send({ status: status, email: email, password: password });
      })
      .catch((e) => {
        console.log(e);
        res.send({ status: "error" });
      });
  } catch (error) {
    console.log(error);
    res.status(404).send({ created: "error" });
  }
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");

mongoose
.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected!!!'))
.catch((err) => console.log(err));

require("./models/user");
require("./models/posts");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(process.env.PORT || 4000, () => {
    console.log("Server is successfully running at port 4000");
});
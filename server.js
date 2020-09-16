const express = require("express");
const app     = express();
const multer  = require("multer");
const path    = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "storage/")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
})
const upload = multer({ storage });


app.use(express.static("public"));

app.post("/uploads", upload.single("file"), (req, res) => {
    if (req.file) {
        res.send(`${process.env.BASEURL}/uploads/${req.file.filename}`);
    } else {
        res.send("FAIL");
    }
});

app.get('/uploads/:file', (req, res) => {
    const name = path.resolve('./storage', req.params.file);
    res.sendFile(name, (err) => {
        if (err) {
            res.sendStatus(404);
            console.log(err)
        }
    });
});

app.listen(process.env.PORT, () => console.log("Up and running on port " + process.env.PORT));
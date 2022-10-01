const express = require("express");
const router = express.Router();
const url = require("url");

// const mongoose =
require("../Config/db");
const Paste = require("../Models/Paste");


router.get("/createPaste", (req, res) => {
    res.render("./CreatePaste.ejs", { title: "Home" });
});

router.post("/paste", async (req, res) => {
    if (!req.body.title) {
        req.body.title = "Untitled";
    }
    req.body.deleteId = Array(12).fill(0).map( _ => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".length)]).join('')
    const paste = new Paste(req.body);
    const response = await paste.save();
    // console.log(response)
    res.redirect(url.format({
        'pathname' : `/paste/${response._id}`,
        'query' : {
            deleteId : req.body.deleteId
        }
    }
    ));
});
router.get('/delete/:deleteId' , (req,res) => {
    Paste.findOneAndDelete({deleteId : req.params.deleteId}, (err, response) => {
        if(err) {
            console.log(err)
        }
        res.redirect('/')
    }
    )
}
)
router.get("/paste/:PasteId", (req, res) => {
    Paste.findById(req.params.PasteId, (err, paste) => {
        if (err) res.send(err);
        else res.render("./paste.ejs", { paste: paste });
    });
});

router.get("/edit/:PasteId", (req, res) => {
    Paste.findById(req.params.PasteId, (err, paste) => {
        if (err) res.send(err);
        else res.render("./editPaste.ejs", { paste: paste });
    });
});
router.post("/edit/:PasteId", (req, res) => {
    Paste.updateOne(
        { _id: req.params.PasteId },
        { $set: { ...req.body, modifiedOn: Date.now() } },
        (err, paste) => {
            if (err) console.log(err);
            res.redirect(`/paste/${req.params.PasteId}`);
        }
    );
});
router.get("/", (req, res) => {
    Paste.find({}, (err, pastes) => {
        if (err) res.send(err);
        else res.render("./allPastes.ejs", { pastes: pastes });
    });
});
router.get("/raw/:PasteId", (req, res) => {
    try {
        Paste.findById(req.params.PasteId, (err, paste) => {
            console.log(paste);
            if (!paste || paste === "null" || err) res.send(err || "Paste not found");
            res.send(paste?.content);
        });
    } catch (err) {
        res.send(err);
    }
});

// Admin Panel
const CheckLogin = (req, res, next) => {
    if (isAdminLogin) next();
    else res.redirect("/admin");
}
let isAdminLogin = false;
router.get("/admin", (req, res) => {
    if (!isAdminLogin) {
        res.render("./AdminLogin.ejs", { LoginError: null });
    }
    else res.redirect("/admin/dashboard");
});

router.get("/admin/dashboard", (req, res) => {
    if (!isAdminLogin) res.redirect("/admin");
    else res.render("./AdminDashboard.ejs", { title: "Admin Dashboard" });
})

router.post("/admin", (req, res) => {
    if (req.body.pin === process.env.PIN) {
        isAdminLogin = true;
        res.redirect("/admin/dashboard");
    }
    else {
        res.render("./AdminLogin.ejs", { LoginError: "Invalid PIN" });
    }
})
router.get('/admin/deleteAll', CheckLogin, (req, res) => {
    Paste.deleteMany({}, (err) => {
        if (err) res.send(err);
        res.redirect('/admin');
    }
    )
})
router.get("/admin/logout", (req, res) => {
    isAdminLogin = false;
    res.redirect("/admin");
})

module.exports = router;

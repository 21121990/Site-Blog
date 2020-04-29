const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require('bcryptjs'); //salvar senha com segurança - npm install --save bcryptjs
const adminAuth =require("../middleware/adminAuth");

router.get("/admin/users",adminAuth, (req, res) => {

    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    });

});

router.get("/admin/users/create",adminAuth, (req, res) => {
    var email = undefined;
    res.render("admin/users/create", { email: email });
});

router.post("/users/create",adminAuth, (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: { email: email }
    }).then(userEmail => {
        if (userEmail == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });

        } else {
            res.render("admin/users/create", { email: email });
        }

    });

});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password, user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    })

})

router.get("/logout", (req, res) =>{
  req.session.user = undefined;
  res.redirect("/login");

})

module.exports = router;
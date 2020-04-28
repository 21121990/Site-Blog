const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req, res) => {

    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    });

});

router.get("/admin/users/create", (req, res) => {
    var email = undefined;
    res.render("admin/users/create",{email:email});
});

router.post("/users/create", (req, res) => {
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
            res.render("admin/users/create",{email:email});
        }

    });

});

module.exports = router;
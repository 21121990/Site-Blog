const express = require("express");
const router = express.Router();
const Articles = require("./Articles");
const Category = require("../Categories/Categories")
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
    Articles.findAll({
        include: [{ model: Category }],
        order:[['id','desc']]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    });
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories })
    })
});


router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Articles.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });

});

router.post("/articles/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {

            Articles.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });

        } else { // Não for número
            res.redirect("/admin/articles");
        }
    } else { //null
        res.redirect("/admin/articles");
    }
})
router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/articles");
    }
    Articles.findByPk(id).then(articles => {
        Category.findAll().then(categories => {

            if (articles != undefined) {
                res.render("admin/articles/edit", { articles: articles, categories: categories });
            } else {
                res.redirect("/admin/articles");
            }
        });
    }).catch(error => {
        res.redirect("/admin/articles");
    })
})

router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Articles.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }, { where: { id: id } }
    ).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
})
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = parseInt(page) * 4 - 4;
    }
    Articles.findAndCountAll({
        limit: 4,
        offset: offset
    }).then(articles => {
        var next;
        if (offset >= articles.count) {
            next = false;
        } else {
            next = true;
        }
        var result = {
            next: next,
            articles: articles
        }
        Category.findAll().then(categories =>{
            res.render("admin/articles/page",{result: result, categories: categories})
        });
    })
})


module.exports = router;
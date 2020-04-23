const express = require("express");
const router = express.Router();

router.get("/Articles",(req, res)=>{
    res.send("Rota de artigos")
});

module.exports = router;
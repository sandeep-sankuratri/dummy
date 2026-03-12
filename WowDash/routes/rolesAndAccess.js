const express = require('express');
const router = express.Router();

router.get('/role-access',(req, res)=>{
    res.render('roleAndAccess/roleAccess', {title: "Role & Access", subTitle:"Role & Access"})
});

module.exports = router;

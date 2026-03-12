const express = require('express');
const router = express.Router();

router.get('/dropdown-management', (req, res) => {
    res.render('settings/dropdownManagement', { title: "Dropdown Management", subTitle: "Settings - Dropdown Management" });
});

module.exports = router;

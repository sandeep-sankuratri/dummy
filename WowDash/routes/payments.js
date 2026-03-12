const express = require('express');
const router = express.Router();

router.get('/itr', (req, res) => {
    res.render('payments/itrPayments', {
        title: 'ITR Payments',
        subTitle: 'Payments - ITR Individual Filing'
    });
});

module.exports = router;

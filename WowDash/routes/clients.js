const express = require('express');
const router = express.Router();

router.get('/add-client', (req, res) => {
    res.render('clients/addClient', { title: 'Add Client', subTitle: 'Clients - Add Client' });
});

router.get('/view-clients', (req, res) => {
    res.render('clients/viewClients', { title: 'View Clients', subTitle: 'Clients - View Clients' });
});


router.get('/view-client/:id', (req, res) => {
    res.render('clients/viewClientDetail', { title: 'Client Details', subTitle: 'Clients - View Client', clientId: req.params.id });
});
module.exports = router;

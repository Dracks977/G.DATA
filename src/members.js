module.exports = function(app, path, ejs, fs) {
    /*
     * Route page d'acceuil
     * redirige les diferent role vers leurs pages
     */
     app.get('/members', function(req, res) {
         LOGS('VIEWMEMBERS', req);
         fs.readFile(path.resolve(__dirname + '/../public/views/members.html'), 'utf-8', (err, content) => {
             if (err) {
                 res.end('error occurred' + err);
                 return;
             }
             let renderedHtml = ejs.render(content, {
                 'user': req.session.db
            }); //get redered HTML code
             res.end(renderedHtml);
         });
     })

     app.post('/api/members/get', function(req, res) {
         USER.dataTables({
             limit: req.body.length,
             skip: req.body.start,
             order: req.body.order,
             columns: req.body.columns,
             formatter: 'toPublic',
             search: {
                 value: req.body.search.value,
                 fields: ['name', 'corp']
             },
             sort: {
                 name: 1
             }
         }).then(function (table) {
             res.json({
                 data: table.data,
                 recordsFiltered: table.total,
                 recordsTotal: table.total
             });
         })
     })

    app.post('/api/members/role', function(req, res) {
        if (req.body._id && req.body.role) {
            if (req.body.role < req.session.db.role || req.session.db.role >= 5) {
                USER.findOneAndUpdate({
                    '_id': req.body._id
                }, {
                    role: req.body.role
                }).exec(function(err, ccc) {
                    LOGS('CHANGEROLE', req, ccc);
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(500);
        }
    })
}
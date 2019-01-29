module.exports = function(app, path, ejs, fs) {
    /*
     * Route page d'acceuil
     * redirige les diferent role vers leurs pages
     */
    app.get('/members', function(req, res) {
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

    app.get('/api/members/get', function(req, res) {
        let role = ["Waiting", "Public", "Private", "Secret", "Top secret", "Extremely Secret", "IT Developer"]
        USER.find({}, function(err, users) {
            if (err) {
                res.status(500).send('What the fuck');
                return;
            }
            let obj = {};
            obj.data = [];
            users.forEach(function(user) {
                obj.data.push([user.name, role[user.role], user._id]);
            });
            res.send(obj);
        })
    })
    app.post('/api/members/role', function(req, res) {
        if (req.body._id && req.body.role) {
            USER.findOneAndUpdate({
                '_id': req.body._id
            }, {
                role: req.body.role
            }).exec(function(err, ccc) {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(500)
        }
    })
}
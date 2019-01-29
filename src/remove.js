module.exports = function(app, path, ejs, fs) {

    app.post('/api/tags/rm', function(req, res) {
        if (req.body._id && req.body.cid) {
            let tags = {
                _id: req.body._id
            };
            CHAR.findById(req.body.cid).exec((err, doc) => {
                if (err)
                    res.send(err);
                let save = doc.tags.id(req.body._id)
                if (save.visibility < req.session.db.role || req.session.db.role >= 5) {
                    save.remove()
                    doc.save((err, result) => {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        } else
                            res.sendStatus(200);
                    })
                } else {
                    res.sendStatus(401);
                }
            })
        } else {
            res.sendStatus(404);
        }
    });

    app.post('/api/intel/rm', function(req, res) {
        if (req.body._id && req.body.cid) {
            CHAR.findById(req.body.cid).exec((err, doc) => {
                if (err) {
                    res.send(err);
                    return;
                }
                if (doc.intels.indexOf(req.body._id) != -1) {
                    INTELS.findById(req.body._id).exec((err2, save) => {
                        if (err2) {
                            res.send(err2);
                            return
                        }
                        if (save.visibility < req.session.db.role || req.session.db.role >= 5) {
                            doc.intels.pull(req.body._id);
                            doc.save();
                            save.remove();
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(401);
                        }
                    });
                } else {
                    res.sendStatus(403);
                }
            });
        } else {
            res.sendStatus(404);
        }
    });

}
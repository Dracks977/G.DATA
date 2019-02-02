const rp = require('request-promise');
// fichier appelle en api
module.exports = {
    search: (name, callback) => {
        let rep = []
        rp('https://esi.evetech.net/latest/search/?categories=character&datasource=tranquility&language=en-us&search='+name+'&strict=false')
        .then(function(htmlString) {
            char = JSON.parse(htmlString).character;
            var options = {
                method: 'POST',
                uri: 'https://esi.evetech.net/latest/universe/names/?datasource=tranquility',
                body: char.slice(0, 10),
                json: true
            };
            rp(options).then(function(info) {
                    callback(null,info);
            }).catch(function(err) {
                callback(err,null);
            });
        }).catch(function(err) {
            callback(err,null);
        });
    },
    //recupere tout les info
    char: (id, callback) => {
        var info = new Object();
        info.id = id;
        rp('https://esi.evetech.net/latest/characters/' + id + '/?datasource=tranquility').then(function(htmlString) {
            info.basic = JSON.parse(htmlString)
            callback(info);
        }).catch(function(err) {
            console.log(err)
        });
    },
    // on enregistre l'user ^pour les tag etc
    charput: (info, callback) => {
        let char = {
            id: info.id,
            name: info.basic.name,
        }
        CHAR.findOneAndUpdate({
            id: info.id
        }, char, {
            upsert: true,
            new: true
        })
        .populate({
            path: 'intels',
            populate: {
                path: 'intels',
                populate: {
                    path: 'from'
                }
            }
        })
        .populate({
            path: 'alts',
            populate: {
                path: 'alts',
                populate: {
                    path: 'intels',
                    populate: {
                        path: 'intels.from'
                    }
                }
            }
        })
        .populate({
            path: 'alts',
            populate: {
                path: 'alts',
                populate: {
                    path: 'tags.from'
                }
            }
        })
        .populate({
            path: 'tags.from'
        })
        .exec((err, ccc) => {
            if (err)
                callback(err);
            callback({
                'db': ccc,
                'basic': info.basic
            });
        });
    },
    corp: (id, callback) => {
        rp('https://esi.evetech.net/latest/corporations/' + id + '/?datasource=tranquility').then(function(htmlString) {
            callback(JSON.parse(htmlString))
        }).catch(function(err) {
            callback(err);
        });
    },
    alliance: (id, callback) => {
        rp('https://esi.evetech.net/latest/alliances/' + id + '/?datasource=tranquility').then(function(htmlString) {
            callback(JSON.parse(htmlString))
        }).catch(function(err) {
            callback(err);
        });
    }
}
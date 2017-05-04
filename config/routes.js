"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports.routes = {
    /***************************************************************************
    *                                                                          *
    * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
    * etc. depending on your default view engine) your home page.              *
    *                                                                          *
    * (Alternatively, remove this and add an `index.html` file in your         *
    * `assets` directory)                                                      *
    *                                                                          *
    ***************************************************************************/
    "/": (req, res) => {
        res.view("homepage", { "title": sails.config.globals.title });
    },
    // returns the configuration for sails-my-admin
    "/_config": (req, res) => {
        res.send({
            "title": sails.config.globals.title,
            "models": Object.keys(sails.models),
        });
    },
    "get /models/:modelName": (req, res) => {
        res.view("models/list", {
            "title": `${req.params.modelName} | ${sails.config.globals.title}`,
            "highlight": req.query.highlight
        });
    },
    // end point to get the count of a model
    "get /:model/count": (req, res) => {
        const model = sails.models[req.params.model];
        model.count().exec((err, count) => {
            if (err) {
                throw err;
            }
            res.send(200, count);
        });
    },
    "/models/:model/create": (req, res) => {
        const title = `New ${req.params.model} | ${sails.config.globals.title}`;
        res.view("models/create-edit", { title });
    },
    "/models/:model/:id": (req, res) => {
        let model = null;
        sails.models[req.params.model].findOne(req.params.id).exec((err, found) => {
            if (err) {
                throw err;
            }
            const title = `Editing #${found.id} ${found.name} | ${sails.config.globals.title}`;
            res.view("models/create-edit", { title });
        });
    },
};
//# sourceMappingURL=routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports.routes = {
    /**
     * Returns the home page.
     */
    "/": (req, res) => {
        res.view("homepage", { "title": sails.config.globals.title });
    },
    /**
     * Returns the configuration for sails-my-admin
     */
    "/_config": (req, res) => {
        res.send({
            "title": sails.config.globals.title,
            "models": Object.keys(sails.models),
        });
    },
    /**
     * Returns the list page for the specified model.
     */
    "get /models/:modelName": (req, res) => {
        res.view("models/list", {
            "title": `${req.params.modelName} | ${sails.config.globals.title}`,
            "highlight": req.query.highlight
        });
    },
    /**
     * Returns the number of rows in a given model.
     */
    "get /:model/count": (req, res) => {
        const model = sails.models[req.params.model];
        model.count().exec((err, count) => {
            if (err) {
                throw err;
            }
            res.send(200, count);
        });
    },
    /**
     * Returns the create page for the specified model.
     */
    "/models/:model/create": (req, res) => {
        const title = `New ${req.params.model} | ${sails.config.globals.title}`;
        res.view("models/create-edit", { title });
    },
    /**
     * Returns the edit page (which is really just the create page) for the specified record in the records of the specified model.
     */
    "/models/:model/:id": (req, res) => {
        let model = null;
        sails.models[req.params.model].findOne(req.params.id).exec((err, found) => {
            if (err) {
                throw err;
            }
            const title = `Editing #${found.id} ${found.name} | ${sails.config.globals.title}`;
            res.view("models/create-edit", { title });
        });
    }
};
//# sourceMappingURL=routes.js.map
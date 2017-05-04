"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports.routes = {
    /**
     * Returns the home page.
     */
    "/": (req, res) => {
        const homePageConfig = {}; // the config for the home page
        const modelNames = Object.keys(sails.models); // the list of modelnames.
        homePageConfig.title = sails.config.globals.title;
        homePageConfig.modelNamesAndRows = [];
        /**
         * For each modelName, set the name and the row count, and send it to the view.
         */
        modelNames.forEach((modelName, i) => {
            const modelNameAndRow = {}; // this is to be stored in the homePageConfig.modelNamesAndRows.
            modelNameAndRow.name = modelName;
            sails.models[modelName].count().exec((err, count) => {
                if (err) {
                    throw err;
                }
                modelNameAndRow.rows = count;
                homePageConfig.modelNamesAndRows.push(modelNameAndRow);
                // if this is the last model the list of modelNames, then render the page.
                const isLastModel = i === modelNames.length - 1;
                if (isLastModel) {
                    res.view("homepage", homePageConfig);
                }
            });
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
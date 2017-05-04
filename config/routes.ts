/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */
import * as Express from "Express";
module.exports.routes = {

  /**
   * Returns the home page.
   */
  "/": (req: Express.Request, res: Express.Response) => {
    res.view("homepage", { "title": sails.config.globals.title });
  },

  /**
   * Returns the configuration for sails-my-admin
   */
  "/_config": (req: Express.Request, res: Express.Response) => {
    res.send({
      "title": sails.config.globals.title,
      "models": Object.keys(sails.models),
    });
  },

  /**
   * Returns the list page for the specified model.
   */
  "get /models/:modelName": (req: Express.Request, res: Express.Response) => {
    res.view("models/list", {
      "title": `${req.params.modelName} | ${sails.config.globals.title}`,
      "highlight": req.query.highlight
    });
  },

  /**
   * Returns the number of rows in a given model.
   */
  "get /:model/count": (req: Express.Request, res: Express.Response) => {
    const model: any = sails.models[req.params.model];
    model.count().exec((err, count) => {
      if (err) { throw err; }
      res.send(200, count);
    });
  },

  /**
   * Returns the create page for the specified model.
   */
  "/models/:model/create": (req: Express.Request, res: Express.Response) => {
    const title: string = `New ${req.params.model} | ${sails.config.globals.title}`;
    res.view("models/create-edit", { title });
  },

  /**
   * Returns the edit page (which is really just the create page) for the specified record in the records of the specified model.
   */
  "/models/:model/:id": (req: Express.Request, res: Express.Response) => {
    let model: string = null;
    sails.models[req.params.model].findOne(req.params.id).exec((err, found) => {
      if (err) { throw err; }
      const title: string = `Editing #${found.id} ${found.name} | ${sails.config.globals.title}`;

      res.view("models/create-edit", { title });
    });
  }

};

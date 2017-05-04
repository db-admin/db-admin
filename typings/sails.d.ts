declare namespace Express {
    interface Response {
        /**
         * Uses the configured view engine to compile the view template at pathToView into HTML. If pathToView is not provided
         * 
         * @param {string} pathToView The path to the desired view file relative to your app's views folder (usually views/), without the
         * file extension (e.g. .ejs), and with no trailing slash. Defaults to "identityOfController/nameOfAction".
         * @param {*} [locals] Data to pass to the view template. These explicitly specified locals will be merged in to Sails' built-in
         * locals and your configured app-wide locals. Defaults to {}.
         * 
         * @memberof Response
         */
        view(pathToView: string, locals?: any): void;
        /**
         * Serves the conventional view based on the current controller and action with the specified locals made available to the view.
         * 
         * @param {*} locals 
         * 
         * @memberof Response
         */
        view(locals: any);
        /**
         * Serves the conventional view based on the current controller and action.
         * 
         * @memberof Response
         */
        view();
    }
}

declare namespace DBAdmin {
    /**
     * The configuration specificiation for the homepage of DBAdmin
     * 
     * @interface IHomePageConfig
     */
    interface IHomePageConfig {
        /**
         * The title of the home page.
         * 
         * @type {string}
         * @memberof IHomePageConfig
         */
        title: string;
        modelNamesAndRows: IModelNameAndRows[];
    }

    /**
     * Represents a quick model reference by providing its name and rows.
     */
    interface IModelNameAndRows {
        /**
         * The name of the model
         * 
         * @type {string}
         */
        name: string,
        /**
         * The amount of rows (records) in the model.
         * 
         * @type {number}
         */
        rows: number
    }
}
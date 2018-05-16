module.exports = class Record {
    /**
     * 
     * @param {any} record The original record returned from a database query
     * @param {string} schema The parent schema name of the databsae of the record
     * @param {string} table The table name of the record
     */
    constructor(record, schema, table) {
        this.id = record.id;
        this.name = record.name;
        this.table = table;
        this.schema = schema;
        this.values = Object.values(record).map(v => v == "" ? null : v);
        this.original = record;
    }

    /**
     * Updates the attribute at the given index
     * @param {number} attributeIndex the index of the column to update
     * @param {Record} newRecord
     */
    updateValue(attributeIndex, newRecord) {
        this.values[attributeIndex] = newRecord;
    }
}

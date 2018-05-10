module.exports = class Record {
    /**
     * @param {{id:number, name:string}}} record 
     */
    constructor(record) {
        this.id = record.id;
        this.name = record.name;
        this.values = Object.values(record);
    }
}
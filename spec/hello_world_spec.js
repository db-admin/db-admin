describe("Hello World Test", function () {
    it("should be true", function () {
        expects(true).toBe(true);
    });
    it("should fail", function () {
        expects(false).toBe(true);
    });

});
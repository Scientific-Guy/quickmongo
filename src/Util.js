const _ = require("lodash");
const Error = require("./Error");

class Util {

    constructor() {
        throw new Error(`Class ${this.constructor.name} may not be instantiated!`);
    }

    /**
     * Returns true if provided key is valid
     * @param str Anything to test
     * @returns {Boolean}
     */
    static isKey(str) {
        return typeof str === "string";
    }

    /**
     * Returns true if the given data is valid
     * @param data Any data
     * @returns {Boolean}
     */
    static isValue(data) {
        if (data === Infinity || data === -Infinity) return false;
        if (typeof data === "undefined") return false;
        return true;
    }

    /**
     * Returns target & key from the given string (quickdb style)
     * @param {string} key key to parse
     * @example Util.parseKey("myitem.items");
     * // -> { key: "myitems", target: "items" }
     */
    static parseKey(key) {
        if (!key || typeof key !== "string") return { key: undefined, target: undefined };
        if (key.includes(".")) {
            let spl = key.split(".");
            let parsed = spl.shift();
            let target = spl.join(".");
            return { key: parsed, target };
        }
        return { key, target: undefined };
    }

    /**
     * Sort data
     * @param {string} key Key
     * @param {Array} data Data
     * @param {object} ops options
     */
    static sort(key, data, ops) {
        if (!key || !data || !Array.isArray(data)) return [];
        let arb = data.filter(i => i.ID.startsWith(key));
        if (ops.sort && typeof ops.sort === 'string') {
            if (ops.sort.startsWith('.')) ops.sort = ops.sort.slice(1);
            ops.sort = ops.sort.split('.');
            arb = _.sortBy(arb, ops.sort).reverse();
        }
        return arb;
    }

    /**
     * Data resolver
     * @param {string} key Data key
     * @param data Data
     * @param value value
     */
    static setData(key, data, value) {
        let parsed = this.parseKey(key);
        if (typeof data === "object" && parsed.target) {
            return _.set(data, parsed.target, value);
        } else if (parsed.target) throw new Error("Cannot target non-object.", "SyntaxError");
        return data;
    }

    /**
     * Data resolver
     * @param {string} key Data key
     * @param data Data
     * @param value value
     */
    static unsetData(key, data) {
        let parsed = this.parseKey(key);
        if (typeof data === "object" && parsed.target) {
            _.unset(data, parsed.target);
        } else if (parsed.target) throw new Error("Cannot target non-object.", "SyntaxError");
        return;
    }

    /**
     * Data resolver
     * @param {string} key Key
     * @param data Data
     */
    static getData(key, data) {
        let parsed = this.parseKey(key);
        if (parsed.target) data = _.get(data, parsed.target);
        return data;
    }
}

module.exports = Util;
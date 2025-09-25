// models/ProductStock.js

class ProductStock {
    constructor(id, product_id, store_id, quantity, updated_at) {
        this.id = id;
        this.product_id = product_id;
        this.store_id = store_id;
        this.quantity = quantity;
        this.updated_at = updated_at;
    }
}

module.exports = ProductStock;

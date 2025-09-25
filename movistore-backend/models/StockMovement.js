// models/StockMovement.js

class StockMovement {
    constructor(id, product_id, store_id, change, reason, created_at) {
        this.id = id;
        this.product_id = product_id;
        this.store_id = store_id;
        this.change = change;
        this.reason = reason;
        this.created_at = created_at;
    }
}

module.exports = StockMovement;

// models/Order.js

class Order {
    constructor(id, user_id, store_id, total, status, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.store_id = store_id;
        this.total = total;
        this.status = status; // 'pending' | 'paid' | 'shipped' | 'cancelled'
        this.created_at = created_at;
    }
}

module.exports = Order;

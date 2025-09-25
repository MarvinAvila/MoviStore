// models/Product.js

class Product {
    constructor(id, name, description, price, sku, category_id, created_at, updated_at) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.sku = sku;
        this.category_id = category_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = Product;

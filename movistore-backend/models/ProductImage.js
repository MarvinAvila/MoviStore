// models/ProductImage.js

class ProductImage {
    constructor(id, product_id, filename, is_thumbnail) {
        this.id = id;
        this.product_id = product_id;
        this.filename = filename;
        this.is_thumbnail = is_thumbnail;
    }
}

module.exports = ProductImage;

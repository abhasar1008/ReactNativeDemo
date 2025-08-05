class Variant {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.compare_at_price = data.compare_at_price;
    this.sku = data.sku;
    this.image = data.image;
  }
}

class Image {
  constructor(data) {
    this.url = data.url;
    this.altText = data.altText;
    this.width = data.width;
    this.height = data.height;
  }
}

class Option {
  constructor(data) {
    this.name = data.name;
    this.values = data.values;
  }
}

class Product {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.vendor = data.vendor;
    this.handle = data.handle;
    this.tags = data.tags;
    this.price = data.price;
    this.discounted_price = data.discounted_price;
    this.discount = data.discount;
    this.hasMultiplePrice = data.hasMultiplePrice;
    this.images = data.images?.map(img => new Image(img)) || [];
    this.variants = data.variants?.map(variant => new Variant(variant)) || [];
    this.collections = data.collections;
    this.options = data.options?.map(opt => new Option(opt)) || [];
    this._rank = data._rank;
    this.isActive = data.isActive;
    this.reviews_count = data.reviews_count;
    this.reviews_average = data.reviews_average;
  }
}

export default Product;

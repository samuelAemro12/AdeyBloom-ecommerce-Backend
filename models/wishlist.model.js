import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        notifyOnSale: {
            type: Boolean,
            default: false
        },
        notifyOnStock: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

// Create compound index to ensure a product can only be added once per user
wishlistSchema.index({ user: 1, 'products.product': 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;

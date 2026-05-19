import './Cart.css'

const CartItem = ({book, quantity, onRemove, 
    onUpdateQuantity
}) => {
    const { id, title, price, thumbnail } = book;
    const itemTotal = price * quantity;

    return (
        <div className="cart-item">
            <img
                src={thumbnail}
                alt={title}
                className="cart-item-image"
            />
            <div className="cart-item-details">
                <div className="cart-item-name">{title}</div>
                <div className="cart-item-price">
                    ₦{price.toLocaleString()} each
                </div>

                <div className="cart-item-controls">
                    <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(id, quantity - 1)}
                    >
                        -
                    </button>
                    <span className="cart-item-quantity">{quantity}</span>
                    <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(id, quantity + 1)}
                    >
                        +
                    </button>
                    <button
                        className="remove-btn"
                        onClick={() => onRemove(id)}
                    >
                        🗑
                    </button>
                </div>

                <div className="cart-item-total">
                    Total: ₦{itemTotal.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default CartItem;


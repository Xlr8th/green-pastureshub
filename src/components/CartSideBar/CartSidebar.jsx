import './Cart.css'
import CartItem from './CartItem'

const CartSidebar = ({ cart, isOpen, onClose, onRemove, onUpdateQuantity }) => {

  const subtotal = cart.reduce((total, { book, quantity }) => total + (book.price * quantity), 0 );
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  return (
    <div className={`cart-sidebar ${isOpen ? 'active' : ''}`}>

      {/* Header */}
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Items or empty state */}
      {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <p>Add some books to get started!</p>
          </div>
      ) : (
          <div className="cart-items">
            {cart.map(item => (
              <CartItem
                key={item.book.id}
                book={item.book}
                quantity={item.quantity}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
      )}

      {/* Footer with totals */}
      <div className="cart-footer">
        <div className="cart-total">
            <span>Subtotal:</span>
            <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="cart-total">
            <span>Tax (7.5%):</span>
            <span>₦{tax.toLocaleString()}</span>
        </div>
        <div className="cart-total total">
            <span>Total:</span>
            <span>₦{total.toLocaleString()}</span>
        </div>
        <button className="checkout-btn">
            Proceed to Checkout
        </button>
      </div>

    </div>
  );
};

export default CartSidebar;


//cartSidebar.classList.toggle('active'); is impertive, i am telling it what and how to do it.
//className={`cart-sidebar ${isOpen ? 'active' : ''}`} this is declarative, i am just telling it what to do. it will figure out how to do it.

// when user clicks '- btn' on cartitem, CartItem calls onRemove(id), onRemove is removeFromCart() living in App, removeFromCart calls setCart([setCart(cart.filter(item => item.book.id !== bookId))]). react sees cart state changed. App re-renders — passes new cart to:Header → cartCount updates automatically ✅CartSidebar → new item appears ✅useEffect → saves to localStorage ✅

// we dont need a seperate functions anymore because we are we are putting it right where we want to use it... no need of storing it in a functions then later destructing it when we need it.. react make it easy for us by enabling us to put the functions in the components that need it. the moment there is change in state in onRemove or onUpdateQuantity it will rerender and it will recalculte the value automatically.

// can we start building now, like a mini project rebuilding all have learnt from module 1 to module 7... guild me through and i will submit my code for review..complete building including css styling for each component..

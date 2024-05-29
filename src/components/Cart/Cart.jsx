import { useDispatch, useSelector } from "react-redux";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import {
  addBasketThunk,
  deleteBasketItemThunk,
  updateItemAmountThunk,
} from "../../redux/actions/basket-actions";

const Cart = (props) => {
  const { addedMeals, isLoading, error } = useSelector((state) => state.basket);
  const dispatch = useDispatch();

  const totalAmount = `$${addedMeals
    .reduce((total, item) => total + item.price * item.amount, 0)
    .toFixed(2)}`;
  const hasItems = addedMeals.length > 0;

  const cartItemRemoveHandler = (id) => {
    const item = addedMeals.find((meal) => meal.id === id);
    if (item.amount === 1) {
      dispatch(deleteBasketItemThunk(id));
    } else {
      dispatch(updateItemAmountThunk(id, -1));
    }
  };

  const cartItemAddHandler = (item) => {
    dispatch(addBasketThunk(item));
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {addedMeals.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={() => cartItemRemoveHandler(item.id)}
          onAdd={() => cartItemAddHandler(item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Общая сумма</span>
        {isLoading && <p style={{ margin: 0 }}>Загрузка...</p>}
        <span>{totalAmount}</span>
      </div>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Закрыть
        </button>
        {hasItems && <button className={classes.button}>Заказать</button>}
      </div>
    </Modal>
  );
};

export default Cart;

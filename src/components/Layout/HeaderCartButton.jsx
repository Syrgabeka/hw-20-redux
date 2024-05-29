import { useEffect, useState } from "react";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";
import { useSelector } from "react-redux";

const HeaderCartButton = (props) => {
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

  const { addedMeals, isLoading, error } = useSelector((state) => state.basket);

  // Подсчет количества товаров в корзине
  const numberOfCartItems = addedMeals.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  // Классы для кнопки
  const btnClasses = `${classes.button} ${
    btnIsHighlighted ? classes.bump : ""
  }`;

  useEffect(() => {
    // Если добавленных блюд нет, не подсвечивать кнопку
    if (addedMeals.length === 0) {
      return;
    }
    // Подсвечиваем кнопку
    setBtnIsHighlighted(true);

    // Сбрасываем подсветку через 300 мс
    const timer = setTimeout(() => {
      setBtnIsHighlighted(false);
    }, 300);

    // Очистка таймера при размонтировании
    return () => {
      clearTimeout(timer);
    };
  }, [addedMeals]); // Обработка изменения addedMeals

  return (
    <button className={btnClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>{isLoading ? "Loading..." : "Your Cart"}</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;

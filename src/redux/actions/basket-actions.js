const BASKET_URL =
  "https://basket-f6772-default-rtdb.firebaseio.com/basket.json";

export const basketActionType = {
  ADD: "ADD_TO_BASKET",
  ERROR: "ERROR",
  LOADING: "LOADING",
  INCREMENT: "INCREMENT_ITEM",
  DECREMENT: "DECREMENT_ITEM",
  REMOVE: "REMOVE_ITEM",
};

const getBasketMealsSuccess = (response) => {
  return {
    type: basketActionType.ADD,
    payload: response,
  };
};

const getBasketMealsFailed = (error) => {
  return {
    type: basketActionType.ERROR,
    payload: error,
  };
};

const getBasketMealsPending = () => {
  return {
    type: basketActionType.LOADING,
  };
};

export const incrementItem = (id) => ({
  type: basketActionType.INCREMENT,
  payload: id,
});

export const decrementItem = (id) => ({
  type: basketActionType.DECREMENT,
  payload: id,
});

export const removeItem = (id) => ({
  type: basketActionType.REMOVE,
  payload: id,
});

//////////////////////////////////!
export const getBasketMealsThunk = () => {
  return async (dispatch) => {
    try {
      const data = await fetch(BASKET_URL);
      const response = await data.json();

      const exchangeResponseArray = [];
      for (const key in response) {
        exchangeResponseArray.push({
          id: key,
          name: response[key].name,
          amount: response[key].amount,
          price: response[key].price,
        });
      }
      dispatch(getBasketMealsSuccess(exchangeResponseArray));
    } catch (error) {
      dispatch(getBasketMealsFailed(error));
    }
  };
};

//////////////////////////////////!
export const addBasketThunk = (newObject) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getBasketMealsPending());

      const { addedMeals } = getState().basket;
      const existingItem = addedMeals.find(
        (item) => item.name === newObject.name
      );

      if (existingItem) {
        dispatch(updateItemAmountThunk(existingItem.id, 1));
      } else {
        await fetch(BASKET_URL, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newObject),
        });

        dispatch(getBasketMealsThunk());
      }
    } catch (error) {
      dispatch(getBasketMealsFailed(error.message));
    }
  };
};
//////////////////////////////////!
export const deleteBasketItemThunk = (id) => {
  return async (dispatch) => {
    try {
      dispatch(getBasketMealsPending());
      await fetch(
        `https://basket-f6772-default-rtdb.firebaseio.com/basket/${id}.json`,
        {
          method: "DELETE",
        }
      );
      dispatch(removeItem(id));
    } catch (error) {
      dispatch(getBasketMealsFailed(error.message));
    }
  };
};

//////////////////////////////////!
export const updateItemAmountThunk = (id, amount) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getBasketMealsPending());
      const { addedMeals } = getState().basket;
      const item = addedMeals.find((meal) => meal.id === id);

      if (item) {
        const updatedAmount = item.amount + amount;

        if (updatedAmount > 0) {
          await fetch(
            `https://basket-f6772-default-rtdb.firebaseio.com/basket/${id}.json`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: updatedAmount }),
            }
          );

          if (amount > 0) {
            dispatch(incrementItem(id));
          } else {
            dispatch(decrementItem(id));
          }
        } else {
          dispatch(deleteBasketItemThunk(id));
        }
      }
    } catch (error) {
      dispatch(getBasketMealsFailed(error.message));
    }
  };
};

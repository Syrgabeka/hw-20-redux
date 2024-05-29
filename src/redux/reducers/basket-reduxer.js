import { basketActionType } from "../actions/basket-actions";

const initialState = {
  addedMeals: [],
  totalPrice: 0,
  isLoading: false,
  error: null,
};
export const basketReduser = (state = initialState, action) => {
  if (action.type === basketActionType.LOADING) {
    return { ...state, isLoading: true };
  }
  if (action.type === basketActionType.ADD) {
    return {
      ...state,
      isLoading: false,
      error: null,
      addedMeals: action.payload,
    };
  }
  if (action.type === basketActionType.ERROR) {
    return { ...state, isLoading: false, error: action.payload };
  }

  if (action.type === basketActionType.INCREMENT) {
    return {
      ...state,
      addedMeals: state.addedMeals.map((item) =>
        item.id === action.payload ? { ...item, amount: item.amount + 1 } : item
      ),
      isLoading: false,
    };
  }
  if (action.type === basketActionType.DECREMENT) {
    return {
      ...state,
      addedMeals: state.addedMeals
        .map((item) =>
          item.id === action.payload
            ? { ...item, amount: item.amount - 1 }
            : item
        )
        .filter((item) => item.amount > 0),
    };
  }
  if (action.type === basketActionType.REMOVE) {
    return {
      ...state,
      addedMeals: state.addedMeals.filter((item) => item.id !== action.payload),
      isLoading: false,
    };
  }

  return state;
};

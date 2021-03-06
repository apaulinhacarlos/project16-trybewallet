import {
  GET_API,
  GET_API_SUCCESS,
  GET_API_ERROR,
  ADD_EXPENSE,
  REMOVE_EXPENSE,
  EDIT_EXPENSE,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  currencies: {},
  expenses: [],
  isFetching: false,
  error: '',
  totalExpense: 0,
  edit: false,
};

const addExpense = (state, payload, responseAPI) => {
  const id = (state.length === 0) ? 0 : state.length;
  const exchangeRates = responseAPI;
  return [...state, { ...payload, id, exchangeRates }];
};

const convertToBRL = (action) => {
  const expenseValue = action.totalExpense;
  const { currency } = action.payload;
  const currencyAsk = action.responseAPI[currency].ask;
  const convertedExpense = (expenseValue * currencyAsk);
  return convertedExpense;
};

const sumExpenses = (state, expenseToSum) => expenseToSum + state.totalExpense;

const subExpenses = (state, action) => {
  const id = state.expenses[action];
  const { ask } = id.exchangeRates[id.currency];
  const askNumber = +ask;
  const { value } = id;
  const valueNumber = +value;
  const convertedValue = (valueNumber * askNumber).toFixed(2);
  const numberConvertedValue = +convertedValue;
  const { totalExpense } = state;
  const totalExpenseFixed = totalExpense.toFixed(2);
  const numberTotalExpenseFixed = +totalExpenseFixed;
  const result = numberTotalExpenseFixed - numberConvertedValue;
  console.log(result);
  return result;
};

const removeExpense = (state, action) => {
  const { expenses } = state;
  const filter = expenses.filter((expense) => expense.id !== +action);
  return filter;
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_API:
    return {
      ...state,
      isFetching: true,
    };

  case GET_API_SUCCESS:
    return {
      ...state,
      currencies: action.payload,
      isFetching: false,
    };

  case GET_API_ERROR:
    return {
      ...state,
      error: action.error,
      isFetching: false,
    };

  case ADD_EXPENSE:
    return {
      ...state,
      expenses: addExpense(state.expenses, action.payload, action.responseAPI),
      totalExpense: sumExpenses(state, convertToBRL(action)),
    };

  case REMOVE_EXPENSE:
    return {
      ...state,
      expenses: removeExpense(state, action.payload),
      totalExpense: parseFloat(subExpenses(state, action.payload)),
      edit: false,
      // parseFloat analisa um argumento string e retorna um numero de ponto flutuante.
    };

  case EDIT_EXPENSE:
    return {
      ...state,
      edit: true,
      // expenses: editExpense(state, action.payload), ??
      // totalExpense: parseFloat(subExpenses(state, action.payload)),
    };

  default:
    return state;
  }
};

export default wallet;

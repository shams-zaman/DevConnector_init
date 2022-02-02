import { SET_ALERT, REMOVE_ALERT } from "../action/types";
const initialState = [];
// {
//   id: 1;
//   msg: "Pls Login";
//   alertType: "success";
// }

//TODO:  D-Structuring for action.payload Or action.type
// const {type,payload}=action;

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}

import * as ACTION_TYPE from "store/actionTypes/roles";

const initialState = {
  error: null,
  filter: "",
  isLoading: false,
  isModalOpen: false,
  isModalLoading: false,
  modalRole: null,
  modalError: null,
  list: [],
};

const reducer = (state = initialState, action) => {
  if (action.type in actionHandlers) {
    const handler = actionHandlers[action.type];
    return action.roleId
      ? handler(state, action.roleId, action.payload)
      : handler(state, action.payload);
  }
  return state;
};

const actionHandlers = {
  [ACTION_TYPE.SET_ROLES]: (state, payload) => {
    return {
      ...state,
      list: payload,
    };
  },
  [ACTION_TYPE.SET_FILTER]: (state, payload) => {
    return {
      ...state,
      filter: payload,
    };
  },
  [ACTION_TYPE.SET_IS_LOADING]: (state, payload) => {
    return {
      ...state,
      isLoading: payload,
    };
  },
  [ACTION_TYPE.SET_IS_MODAL_OPEN]: (state, payload) => {
    return {
      ...state,
      isModalOpen: payload,
    };
  },
  [ACTION_TYPE.SET_IS_MODAL_LOADING]: (state, payload) => {
    return {
      ...state,
      isModalLoading: payload,
    };
  },
  [ACTION_TYPE.SET_MODAL_ROLE]: (state, payload) => {
    return {
      ...state,
      modalRole: payload,
    };
  },
  [ACTION_TYPE.CREATE_ROLE]: (state, payload) => {
    return {
      ...state,
      list: [...state.list, payload],
    };
  },
  [ACTION_TYPE.UPDATE_ROLE]: (state, roleId, payload) => {
    const roleIdx = state.list.findIndex((r) => r.id === roleId);
    return {
      ...state,
      list: [
        ...state.list.slice(0, roleIdx),
        payload,
        ...state.list.slice(roleIdx + 1),
      ],
    };
  },
  [ACTION_TYPE.DELETE_ROLE]: (state, roleId) => {
    const roleIdx = state.list.findIndex((r) => r.id === roleId);
    return {
      ...state,
      list: [...state.list.slice(0, roleIdx), ...state.list.slice(roleIdx + 1)],
    };
  },
  [ACTION_TYPE.SET_ERROR]: (state, error) => {
    console.error(error);
    return {
      ...state,
      error,
    };
  },
  [ACTION_TYPE.SET_MODAL_ERROR]: (state, error) => {
    console.error(error);
    return {
      ...state,
      modalError: error,
    };
  },
};

export default reducer;

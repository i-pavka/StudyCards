import {AppThunkType} from "../../../sc1-main/m2-bll/store";
import {ProfileApi, UserType} from "../../../sc1-main/m3-dal/profile-api";
import {handleAppRequestError} from "../../../sc3-utils/errorUtils";

// Types
type InitStateType = typeof initState;
type SetAuthDataActionType = ReturnType<typeof setAuthDataAC> | ReturnType<typeof loadingStatusAC>;
export type ProfileActionsType = SetAuthDataActionType;

// Initial state
const initState = {
  loading: false,
  user: {} as UserType,
};

// Action creators
export const setAuthDataAC = (user: UserType) => ({type: "profile/SET-AUTH-DATA", user} as const);
export const loadingStatusAC = (value: boolean) => ({type: "profile/LOADING-STATUS", value} as const);

// Thunk creators
export const updateNameThunk = (name: string, avatar: string): AppThunkType => (dispatch) => {
  dispatch(loadingStatusAC(true));
  ProfileApi.updateUserData(name, avatar)
    .then(res => {
      dispatch(setAuthDataAC(res.updatedUser));
    })
    .catch(error => handleAppRequestError(error, dispatch))
    .finally(() => dispatch(loadingStatusAC(false)))
};
export const profileReducer = (state: InitStateType = initState, action: ProfileActionsType): InitStateType => {
  switch (action.type) {
    case "profile/SET-AUTH-DATA":
      return {...state, user: action.user};
    case "profile/LOADING-STATUS":
      return {...state, loading: action.value}
    default:
      return state;
  }
};

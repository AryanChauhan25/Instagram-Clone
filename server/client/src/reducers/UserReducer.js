export const initialState = null;

export const Reducer = (state, action) => {
    if(action.type === "USER") {
        return action.payload;
    }
    if(action.type === "UPDATE_PROFILE") {
        return {
            ...state,
            followers : action.payload.followers,
            following : action.payload.following
        }
    }
    if(action.type === "UPDATE") {
        return {
            ...state,
            followers : action.payload.followers,
            following : action.payload.following
        }
    }
    if(action.type === "UPDATEPIC") {
        return {
            ...state,
            image : action.payload
        }
    }
    if(action.type === "CLEAR") {
        return null;
    }
    return state;
}
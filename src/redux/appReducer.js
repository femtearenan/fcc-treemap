// Your basic state management logic here
import { REQUEST_DATA, RESOLVED_GET_DATA } from './actions';

const initialState = {
    requests: 0,
    isOK: false,
    kickstarterData: [],
    movieData: [],
    gameData: []
};

function appReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_DATA:
            return Object.assign({}, state, {
                requests: state.requests + 1
            });
        case RESOLVED_GET_DATA:
            let datatype = action.datatype;
            return Object.assign({}, state, {
                requests: state.requests - 1,
                isOK: state.requests - 1 === 0,
                [datatype]: action.payload.data
            })
        default:
            return state;
    }
}

export default appReducer;
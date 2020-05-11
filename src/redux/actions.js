export const REQUEST_DATA = "REQUEST_DATA";
export const RESOLVED_GET_DATA = "RESOLVED_GET_DATA";
export const FAILED_GET_DATA = "FAILED_GET_DATA";

export const KICKSTARTER_DATA = "kickstarterData";
export const MOVIE_DATA = "movieData";
export const GAME_DATA = "gameData";


export const getData = (datatype) => {
    const url = datatype === KICKSTARTER_DATA ? 
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json" :
        datatype === MOVIE_DATA ? 
            "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json" :
            "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
    
    return function (dispatch) {
        dispatch(requestData());

        return fetch(url)
            .then(response => response.json(), error => console.log('An error occured: ', error))
            .then(json => dispatch(resolvedGetData(datatype, json)));
    }

}

export const requestData = () => {
    return {
        type: REQUEST_DATA
    }
}

export const resolvedGetData = (datatype, json) => {
    return {
        type: RESOLVED_GET_DATA,
        datatype: datatype,
        payload: {
            data: json
        }
    }
}
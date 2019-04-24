import * as actionTypes from './actionTypes';
import { fromJS} from 'immutable';
const defaultState = fromJS({
    citys: [],
    tableData: [],
    chartData: [],
    modalVisible: false,
    modalTitle: '',
    modalData: []
}
);

export default (state=defaultState, action) => {
    switch (action.type) {
        case actionTypes.GET_CITYS:
            return state.set('citys', fromJS(action.payload.citys));
        case actionTypes.GET_TABLE_DATA: 
            return state.set('tableData', action.payload.tableData);
        case actionTypes.GET_CHART_DATA: 
            return state.set('chartData', action.payload.chartData);
        case actionTypes.CHANGE_MODAL_VISIBLE:
            return state.set('modalVisible', action.payload.modalVisible);
        case actionTypes.GET_MODAL_DATA: 
            return state.set('modalTitle', action.payload.modalTitle).set('modalData', action.payload.modalData);
        default:
            break;
    }
    return state;
}
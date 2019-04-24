import * as actionTypes from './actionTypes';
import axios from 'axios';
import { fromJS } from 'immutable';
import { from } from 'rxjs';


export const getCitys = (value) => {
    return {
        type: actionTypes.GET_CITYS,
        payload: {
            citys: value
        }
    }
}

export const getTableData = (citys) => {
    return (dispatch) => {
        citys = citys.length > 0 ? citys : ['北京', '上海', '杭州', '成都', '深圳'];
        citys = citys.map((item) => {
            let adcode = '';
            switch (item) {
                case '北京':
                    adcode = '110100';
                    break;
                case '上海':
                    adcode = '310100';
                    break;
                case '杭州':
                    adcode = '330100';
                    break;
                case '成都': 
                    adcode = '510100';
                    break;
                case '深圳':
                    adcode = '440300';
                    break;
                case '天津':
                    adcode = '120100';
                    break;
                case '黑龙江':
                    adcode = '230000';
                    break;
                case '武汉':
                    adcode = '420100';
                    break;
                case '苏州':
                    adcode = '320500';      
                    break;  
                default:
                    adcode = '';
                    break;
            }
            return {name: item, adcode: adcode}
        });
        let tableDataPromises = [];
        let chartDataPrimises = [];
        citys.forEach(city => {
            tableDataPromises.push(axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=237bbdf24c42506b48ce345973f20cff', {
                params: {
                    city: city.adcode,
                }
            }));
            chartDataPrimises.push(axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=237bbdf24c42506b48ce345973f20cff', {
                params: {
                    city: city.adcode,
                    extensions: 'all',
                }
            }))
        });
        Promise.all(tableDataPromises).then((res) => {
            dispatch({
                type: actionTypes.GET_TABLE_DATA,
                payload: {
                    tableData: fromJS(res)
                }
            })
        });
        Promise.all(chartDataPrimises).then((res) => {
            dispatch({
                type: actionTypes.GET_CHART_DATA,
                payload: {
                    chartData: fromJS(res)
                }
            })
        })
    }
}


export const getModalData = (text = '') => {
    let adcode = '';
    switch (text) {
        case '北京':
            adcode = '110100';
            break;
        case '上海':
            adcode = '310100';
            break;
        case '浙江':
            adcode = '330100';
            break;
        case '四川': 
            adcode = '510100';
            break;
        case '广东':
            adcode = '440300';
            break;
        case '天津':
            adcode = '120100';
            break;
        case '黑龙江':
            adcode = '230000';
            break;
        case '湖北':
            adcode = '420100';
            break;
        case '江苏':
            adcode = '320500';      
            break;  
        default:
            adcode = '';
            break;
    }
    return (dispatch) => {
        axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=237bbdf24c42506b48ce345973f20cff', {
            params: {
                city: adcode,
                extensions: 'all'
            }
        }).then((res) => {
            dispatch({
                type: actionTypes.GET_MODAL_DATA,
                payload: {
                    modalTitle: `${text}未来3天天气预测`,
                    modalData: fromJS(res.data.forecasts[0].casts)
                }
            })
        })
    }
}

export const changeModalVisible = (flag) => {
    return {
        type: actionTypes.CHANGE_MODAL_VISIBLE,
        payload: {
            modalVisible: flag  
        }
    }
}



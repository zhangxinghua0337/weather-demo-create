import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Button, Table, Modal, Col } from 'antd';
import Chart from '../Charts2/MiniBar/index';
import * as constant from '../../constant';
import * as actionCreator from '../../store/actionCreator';
import './index.less';

function formatTableData(tableData) {
    let newTableData = []
    tableData.forEach((item) => {
       newTableData.push(item.data.lives[0]);
    })
    return newTableData;
}

function formatChartData(chartData) {
    let newChartData = [];
    chartData.forEach((item) => {
        newChartData.push(item.data.forecasts[0]);
    });
    newChartData = newChartData.map((data) => {
        data.casts = data.casts.map((cast) => {
            return [new Date(cast.date).getTime(), parseFloat(cast.daytemp)]
        });
        return {
            name: data.province,
            data: data.casts
        } 
    });
    return newChartData;
}

class Weather extends Component {  
    componentDidMount() {
        this.props.getTableData(actionCreator.getTableData(this.props.citys));
    }
    handleSearch = () => {  
        // 拿到citys发送请求
        this.props.getTableData(actionCreator.getTableData(this.props.citys))
    }
    handleSelectChange = (value) => {
        this.props.getCitys(actionCreator.getCitys(value));
    }
    showModal = (text) => {
        this.props.changeModalVisible(actionCreator.changeModalVisible(true));
        this.props.getModalData(actionCreator.getModalData(text));
    }
    handleOk = () => {
        this.props.changeModalVisible(actionCreator.changeModalVisible(false));
    }
    handleCancel = () => {
        this.props.changeModalVisible(actionCreator.changeModalVisible(false));
    }
    render() {
        const { tableData, chartData, modalVisable, modalTitle, modalData } = this.props;
        const options = {
            title: '',
            chart: {
              type: 'line',
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%Y-%m-%d'
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    format: `{value}℃`
                }
            },
            tooltip: {
              shared: true,
              valueDecimals: 2,
              valueSuffix: '℃',
              xDateFormat: '%Y-%m-%d %H:%M'
            },
            series: formatChartData(chartData),
            legend: {
              enabled: true,
            },
        };
        const columns = [
            {title: '城市',dataIndex: 'province',render: text => <a href="javascript:;" onClick={this.showModal.bind(this, text)}>{text}</a>,},
            {title: '天气',dataIndex: 'weather',filters: [{text: '晴', value: '晴'}, {text:'多云', value: '多云'}, {text: '雨', value: '雨'}, {text: '阴', value: '阴'},{text:'雪', value: '雪'}],  onFilter: (value, record) => record.weather.indexOf(value) === 0,
            },
            {title: '气温',dataIndex: 'temperature', sorter: (a, b) => a.temperature - b.temperature},
            {title: '风力',dataIndex: 'windpower', sorter: (a, b) => a.windpower - b.windpower},
            {title: '风向',dataIndex: 'winddirection'},
            {title: '湿度',dataIndex: 'humidity', sorter: (a, b) => a.humidity - b.humidity}
        ];
        return (
            <div className="container">
                <div style={{ marginBottom: 20 }}>
                    城市: <Select style={{ width: '30%', marginRight: 20, marginLeft: 20 }} mode="multiple" placeholder="请选择城市" onChange={this.handleSelectChange}>
                        {
                            constant.citys.map((item) => {
                                return (
                                    <Select.Option key={item.name}>{item.name}</Select.Option>
                                )
                            })
                        }
                    </Select>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 12 }}>时间: {new Date().toLocaleDateString()}</p>
                    <Table dataSource={formatTableData(tableData)} columns={columns} />
                </div>
                <Modal
                    title={modalTitle}
                    visible={modalVisable}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Table columns={constant.columns} dataSource={modalData} />
                </Modal>
                <div>
                    <Chart options={options} height={400}>
                    </Chart>
                </div>
            </div>
        )
    }
}

export default connect((state)=>({
    citys: state.get('citys').toJS(),
    tableData: state.get('tableData').toJS(),
    chartData: state.get('chartData').toJS(),
    modalVisable: state.get('modalVisible'),
    modalTitle: state.get('modalTitle'),
    modalData: state.get('modalData').toJS()
}), (dispatch) => ({
    getCitys(action){
        dispatch(action);
    },
    getTableData(action) {
        dispatch(action);
    },
    changeModalVisible(action) {
        dispatch(action);
    },
    getModalData(action){
        dispatch(action);
    }
}))(Weather);
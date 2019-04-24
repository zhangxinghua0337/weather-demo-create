import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import styles from '../index.less';

// 判断两份series数据是否相同，相同就不刷新，否则刷新
function judgeDataSame(series1, series2) {
  if (series1.length === 0 && series2.length === 0) return true;
  if (series1.length !== series2.length) return false;
  for (let i = 0; i < series1.length; i += 1) {
    if (series1[i].name !== series2[i].name) {
      // console.log(`serires名字不同：${series1[i].name} - ${series2[i].name}`);
      return false;
    }
    if (series1[i].data.length !== series2[i].data.length) {
      // console.log(`serires data长度不同：${series1[i].data.length} - ${series2[i].data.length}`);
      return false;
    }

    const len = series1[i].data.length;
    if (len === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }
    // [12213123, 22]
    if (Array.isArray(series1[i].data[0]) && Array.isArray(series2[i].data[0])) {
      if (
        series1[i].data[0][0] !== series2[i].data[0][0] ||
        series1[i].data[0][1] !== series2[i].data[0][1] ||
        series1[i].data[len - 1][0] !== series2[i].data[len - 1][0] ||
        series1[i].data[len - 1][1] !== series2[i].data[len - 1][1] ||
        series1[i].data[Math.floor(len / 2)][0] !== series2[i].data[Math.floor(len / 2)][0] ||
        series1[i].data[Math.floor(len / 2)][1] !== series2[i].data[Math.floor(len / 2)][1]
      ) {
        return false;
      }
    } else if (series1[i].data[0].x !== undefined && series2[i].data[0].x !== undefined) {
      if (
        series1[i].data[0].x !== series2[i].data[0].x ||
        series1[i].data[0].y !== series2[i].data[0].y ||
        series1[i].data[len - 1].x !== series2[i].data[len - 1].x ||
        series1[i].data[len - 1].y !== series2[i].data[len - 1].y ||
        series1[i].data[Math.floor(len / 2)].x !== series2[i].data[Math.floor(len / 2)].x ||
        series1[i].data[Math.floor(len / 2)].y !== series2[i].data[Math.floor(len / 2)].y
      ) {
        return false;
      }
    } else {
      // column型堆叠图
      // series: [{name: 'xx', data: [1,2,3,4]}]
      // console.log('column型堆叠图');
      let flag = true;
      series1.forEach((element, index) => {
        if (JSON.stringify(element.data) !== JSON.stringify(series2[index].data)) {
          flag = false;
        }
      });
      return flag;
    }
  }
  return true;
}


class BaseChart extends Component {
  constructor() {
    super();
    this.lastSeries = [];
    this.force = false;
  }
  componentDidMount() {
    const { options, type, force } = this.props;
    this.force = !!force;
    this.renderChart(options, type);
    // setTimeout(() => {
    //   if (this && this.chart) {
    //     console.log(this);
    //     this.chart.reflow();
    //   }
    // }, 300); // 修复图表第一次渲染不能自适应bug,这边即使调用reflow不给300或者时间太短,还是不能自适应
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.options.series === nextProps.options.series) {
      // console.log('series same');
      return;
    }
    this.renderChart(
      nextProps.options,
      nextProps.type
    );
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  handleRef = (n) => {
    this.node = n;
  }

  renderChart(options, type) {
    const { node } = this;
    if (
      this.chart
      && judgeDataSame(options.series, this.lastSeries)
      && !type
      && !this.force
    ) {
      // console.log('same');
      return;
    }
    // console.log('not same', options.series, this.lastSeries);
    this.lastSeries = JSON.parse(JSON.stringify(options.series || []));
    const chart = ReactHighcharts.Highcharts.chart(node, options);
    this.chart = chart;

    // const { labels } = this.props;
    // this.labelArr = [];
    // if (labels) { // 手动添加labels
    //   for (let i = 0; i < labels.items.length; i += 1) {
    //     const { html } = labels.items[i];
    //     const { style } = labels.items[i];
    //     console.log(html)
    //     const label = this.chart.renderer.label(html, style.left, style.top).add();
    //     this.labelArr.push(label);
    //   }
    // }
    if (type) {
      for (let i = 0; i < options.series.length; i += 1) { // 切换图表类型
        this.chart.series[i].update({ type });
      }
      if (type === 'column') this.chart.series[options.series.length - 1].remove(); // 柱状图不要total字段
    }
  }
  render() {
    const { height, customStyle } = this.props;
    return (
      <div className={styles.miniChart} style={customStyle}>
        <div ref={this.handleRef} style={{ height }} />
      </div>
    );
  }
}

export default BaseChart;

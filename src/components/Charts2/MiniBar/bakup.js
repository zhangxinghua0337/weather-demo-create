import React, { PureComponent } from 'react';
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';
import styles from '../index.less';

class BaseChart extends PureComponent {
  componentDidMount() {
    const { options, isloading, type } = this.props;
    this.renderChart(options, isloading, null, type);
  }
  componentWillReceiveProps(nextProps) {
    // const { once } = this.props; // 如果页面只是纯展示一次，不带搜索功能的图，不需要再次renderchart
    let force = false;
    const oldSeries = this.chart ? this.chart.series : [];
    if (
      oldSeries.length !== nextProps.options.series.length ||
      typeof this.chart.options.tooltip.formatter !== typeof nextProps.options.tooltip.formatter
    ) {
      force = true;
    }
    this.renderChart(
      nextProps.options,
      nextProps.isloading,
      nextProps.force || force,
      nextProps.type
    );
  }
  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  handleRef = (n) => {
    this.node = n;
  }

  renderChart(options, isloading, force, type) {
    const { node } = this;
    const { labels } = this.props;
    if (!this.chart || force) {
      const chart = ReactHighcharts.Highcharts.chart(node, options);
      this.chart = chart;
      this.labelArr = [];
      if (labels) { // 手动添加labels
        for (let i = 0; i < labels.items.length; i += 1) {
          const { html } = labels.items[i];
          const { style } = labels.items[i];
          const label = this.chart.renderer.label(html, style.left, style.top).add();
          this.labelArr.push(label);
        }
      }
    } else {
      // this.chart.update(options);
      for (let i = 0; i < options.series.length; i += 1) { // series.length is undefined
        if (!_.isEqual(options.series[i], this.chart.series[i])) {
          this.chart.series[i].setData(options.series[i].data);
        }
      }
      // 兼容排行图
      if (options.xAxis && options.xAxis.categories) {
        this.chart.xAxis[0].update(options.xAxis);
      }
      if (labels && this.labelArr.length !== 0) { // 手动更新labels
        for (let i = 0; i < labels.items.length; i += 1) {
          const { html } = labels.items[i];
          this.labelArr[i].attr({ text: html });
        }
      }
    }
    if (type) {
      for (let i = 0; i < options.series.length; i += 1) { // 切换图表类型
        this.chart.series[i].update({ type });
      }
      if (type === 'column') this.chart.series[options.series.length - 1].remove(); // 柱状图不要total字段
    }
    // 强制reflow
    // setTimeout(() => {
    //   this.chart.reflow();
    // }, 100);
    if (isloading) {
      this.chart.showLoading();
    } else {
      this.chart.hideLoading();
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

import React, { Component } from 'react';
import { message } from 'antd';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler from './custom/custom-modeler';
import propertiesProviderModule from './custom/magic';
import EditingTools from '../../components/EditingTools';

import styles from './index.less';

class BpmnView extends Component {
  constructor() {
    super();
    this.state = {
      scale: 1, // 流程图比例
    };
  }

  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule, // 自定义右侧属性栏
      ],
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties-panel',
      },
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    });

    this.renderDiagram(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.renderDiagram(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.idx !== this.props.idx;
  }

  // componentWillUnmount() {
  //   if (document.getElementById('camunda-title')) {
  //     document.getElementById('camunda-title').removeEventListener('change', this.saveTitle);
  //   }
  // }

  // 暂存title至本地
  // saveTitle = (e) => {
  //   const { id, value } = e.target;
  //   if (id === 'camunda-title' && value) {
  //     localStorage.setItem('title', value);
  //   }
  // }

  /**
   * 下载xml/svg
   *  @param  type  类型  svg / xml
   *  @param  data  数据
   *  @param  name  文件名称
   */
  download = (type, data, name) => {
    let dataTrack = '';
    const a = document.createElement('a');

    switch (type) {
      case 'xml':
        dataTrack = 'bpmn';
        break;
      case 'svg':
        dataTrack = 'svg';
        break;
      default:
        break;
    }

    name = name || `diagram.${dataTrack}`;

    a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
    a.setAttribute('download', name);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 导入xml文件
  handleOpenFile = e => {
    const that = this;
    const file = e.target.files[0];
    const reader = new FileReader();
    let data = '';
    reader.readAsText(file);
    reader.onload = function(event) {
      data = event.target.result;
      // 导入的xml流程名称根据父组件传值来定
      // const xml = data.indexOf('flowable:title') !== -1
      //   ? data.replace(/flowable:title="(.*)"/, `flowable:title="${that.props.name}"`)
      //   : data.replace('<process ', `<process flowable:title="${that.props.name}" `);

      that.renderDiagram(data, 'open');
    };
  };

  // 保存
  handleSave = () => {
    this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
      if (this.props.onSave) {
        const params = {
          name: this.props.name,
          xml,
          id: this.props.idx,
        };

        this.props.onSave(params);
      }
    });
  };

  // 前进
  handleRedo = () => {
    this.bpmnModeler.get('commandStack').redo();
  };

  // 后退
  handleUndo = () => {
    this.bpmnModeler.get('commandStack').undo();
  };

  // 下载SVG格式
  handleDownloadSvg = () => {
    this.bpmnModeler.saveSVG({ format: true }, (err, data) => {
      this.download('svg', data);
    });
  };

  // 下载XML格式
  handleDownloadXml = () => {
    this.bpmnModeler.saveXML({ format: true }, (err, data) => {
      this.download('xml', data);
    });
  };

  // 流程图放大缩小
  handleZoom = radio => {
    const newScale = !radio
      ? // 不输入radio则还原
        1.0
      : // 最小缩小倍数
        this.state.scale + radio <= 0.2
        ? 0.2
        : this.state.scale + radio;

    this.bpmnModeler.get('canvas').zoom(newScale);
    this.setState({
      scale: newScale,
    });
  };

  // 解析xml文档
  renderDiagram = (props, type) => {
    localStorage.removeItem('title');
    const { xml } = props;
    let newXml = '';
    if (type === 'open') {
      // 导入xml文件
      newXml = props;
    } else if (xml) {
      // 如果传入xml，则按xml来渲染
      newXml = xml;
    }
    // else {
    //   // 按模板渲染，需将模板的流程名称改成用户定义的流程名称
    //   newXml = name ? diagramXML.replace('name="Vocation process"', `flowable:title="${name}"`) : diagramXML;
    // }

    this.bpmnModeler.importXML(newXml, err => {
      if (err) {
        message.error('导入失败，请重试');
      }
      // else {
      //   // 监控用户输入流程名称，用于防止以下情况：如果用户保存前鼠标停留在具体步骤，则会取不到title
      //   const eTitleInput = document.getElementById('camunda-title');
      //   localStorage.setItem('title', eTitleInput.value);
      //   document.getElementById('properties-panel').addEventListener('change', this.saveTitle);
      // }
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content} id="js-drop-zone">
          <div className={styles.canvas} id="canvas" />
          <div className={`properties-panel-parent ${styles.panel}`} id="properties-panel" />
          <EditingTools
            onOpenFIle={this.handleOpenFile}
            onSave={this.handleSave}
            onUndo={this.handleUndo}
            onRedo={this.handleRedo}
            onDownloadSvg={this.handleDownloadSvg}
            onDownloadXml={this.handleDownloadXml}
            onZoomIn={() => this.handleZoom(0.1)}
            onZoomOut={() => this.handleZoom(-0.1)}
            onZoomReset={() => this.handleZoom()}
          />
        </div>
      </div>
    );
  }
}

export default BpmnView;

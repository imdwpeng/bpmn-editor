import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { diagramXML } from './newDiagram';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import styles from './BpmnModal.less';

export default class BpmnModal extends Component {
  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties-panel',
      },
    });

    this.renderDiagram(diagramXML);
  }

  renderDiagram = xml => {
    this.bpmnModeler.importXML(xml, err => {
      if (err) {
        console.log('导入失败');
      } else {
        console.log('导入成功');
      }
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.canvas} id="canvas" />
        <div
          className={`properties-panel-parent ${styles.panel}`}
          id="properties-panel"
          style={{ height: '100%' }}
        />
      </div>
    );
  }
}

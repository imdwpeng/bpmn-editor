<<<<<<< HEAD:src/routes/Usage/Basic.js
import React, {
  Component
} from 'react';
import {
  connect
} from 'dva';
import BpmnModeler from 'bpmn-js/lib/Modeler';
=======
import React, { Component } from 'react';
>>>>>>> dev:custom-menu/src/containers/index.js
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import BpmnModeler from './modeler';
import { diagramXML } from '../sources/xml';
import './Common.sass';
import styles from './Bpmn.module.scss';

<<<<<<< HEAD:src/routes/Usage/Basic.js
import {
  diagramXML
} from '../../assets/newDiagram';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import styles from './Bpmn.less';

@connect()
=======
>>>>>>> dev:custom-menu/src/containers/index.js
export default class Bpmn extends Component {
  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties-panel'
      },
      additionalModules: [propertiesPanelModule, propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });

    this.renderDiagram(diagramXML);
  }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log('导入失败');
      } else {
        console.log('导入成功');
      }
    });
  };

  render() {
    return ( 
      <div className = {styles.container} >
        <div className = {styles.canvas} id = "canvas" />
        <div className = {`properties-panel-parent ${styles.panel}`} id = "properties-panel" style = {{height: '100%'}}/> 
      </div>
    );
  }
}

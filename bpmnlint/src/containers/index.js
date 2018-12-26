import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import lintModule from 'bpmn-js-bpmnlint';
import bpmnlintConfig from '../.bpmnlintrc';
import { diagramXML } from '../sources/xml';
import './Common.sass';
import styles from './Bpmn.module.scss';

 // helpers /////////////////////////////////

 function setUrlParam(name, value) {

  var url = new URL(window.location.href);

  if (value) {
    url.searchParams.set(name, 1);
  } else {
    url.searchParams.delete(name);
  }

  window.history.replaceState({}, null, url.href);
}

function getUrlParam(name) {
  var url = new URL(window.location.href);

  return url.searchParams.has(name);
}

export default class Bpmn extends Component {
  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
  additionalModules: [
    lintModule
  ],
  linting: {
    bpmnlint: bpmnlintConfig
  },
  keyboard: {
    bindTo: document
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

    this.bpmnModeler.on('linting.toggle', function(event) {

      var active = event.active;

      setUrlParam('linting', active);
    });

    const that = this;
    this.bpmnModeler.on('import.done', function() {
      var active = getUrlParam('linting');

      var linting = that.bpmnModeler.get('linting');

      if (active) {
        linting.activateLinting();
      } else {
        linting.deactivateLinting();
      }
    });

    this.bpmnModeler.on('import.parse.start', function(event) {
      var xml = event.xml;

      window.localStorage.setItem('diagramXML', xml);
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

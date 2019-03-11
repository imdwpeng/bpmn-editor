# Custom Menu

------

![此处输入图片的描述][1]

## import custom modeler

```js
// import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnModeler from './modeler';

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
```

## set custom replace options

```js
export const START_EVENT = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  // {
  //   label: 'Intermediate Throw Event',
  //   actionName: 'replace-with-none-intermediate-throwing',
  //   className: 'bpmn-icon-intermediate-event-none',
  //   target: {
  //     type: 'bpmn:IntermediateThrowEvent'
  //   }
  // },
  {
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  }
  ...
]
...
```




  [1]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/custom_menu.png

# Custom Palette

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

## set custom palette

```js
...
assign(actions, {
  'hand-tool': {
    group: 'tools',
    className: 'bpmn-icon-hand-tool',
    title: translate('Activate the hand tool'),
    action: {
      click(event) {
        handTool.activateHand(event);
      }
    }
  },
  'lasso-tool': {
    group: 'tools',
    className: 'bpmn-icon-lasso-tool',
    title: translate('Activate the lasso tool'),
    action: {
      click(event) {
        lassoTool.activateSelection(event);
      }
    }
  },
  'tool-separator': {
    group: 'tools',
    separator: true
  },
  'create.start-event': createAction(
    'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
  ),
  'create.intermediate-event': createAction(
    'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none'
  ),
  'create.exclusive-gateway': createAction(
    'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
  ),
  'create.task': createAction(
    'bpmn:Task', 'activity', 'bpmn-icon-task'
  )
  }
);
...
```

## change the render of palette if you want




  [1]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/custom_palette.png

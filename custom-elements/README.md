# Custom Elements

------

![此处输入图片的描述][1]

## import custom elements

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

## set custom elements

[CustomElements][2]: A renderer that knows how to draw custom elements





  [1]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/custom_elements.png
  [2]: https://github.com/imdwpeng/bpmn-editor/blob/master/custom-elements/src/containers/modeler

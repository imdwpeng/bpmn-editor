# i18n

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

## set translation options

```js
export default {
  ...
  'Send Task': '发送任务',
  'Receive Task': '接收任务',
  'User Task': '用户任务',
  'Manual Task': '手动任务',
  'Business Rule Task': '业务规则任务',
  'Service Task': '归档任务',
  'Script Task': '脚本任务',
  'Call Activity': '调用活动',
  'Sub Process (collapsed)': '子进程（收起）',
  'Sub Process (expanded)': '子进程（展开）',
  ...
};
```




  [1]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/i18n.png

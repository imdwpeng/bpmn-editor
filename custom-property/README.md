#Custom Property

------

![此处输入图片的描述][1]

import custom propertiesProviderModule

```js
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import propertiesProviderModule from './magic';

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

set custom properties of forms

eg. Checkbox
```js
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

export default function (group, element, bpmnFactory, translate) {
  const checkboxGroup = entryFactory.checkbox({
    id: 'customCheckbox',
    label: translate('自定义复选框'),
    modelProperty: 'camunda:customCheckbox'
  });

  group.entries.push(checkboxGroup);
}
```

set custom properties provider

```js
import inherits from 'inherits';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

import inputTxtProps from './parts/InputTxtProps';
import checkboxProps from './parts/CheckboxProps';
import selectProps from './parts/SelectProps';
import userCustomProps from './parts/UserCustomProps';
import DynamicSelectProps from './parts/DynamicSelectProps';

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {
  const generalGroup = {
    id: 'general',
    label: '',
    entries: []
  };

  inputTxtProps(generalGroup, element, bpmnFactory, translate);
  checkboxProps(generalGroup, element, bpmnFactory, translate);
  selectProps(generalGroup, element, bpmnFactory, translate);
  userCustomProps(generalGroup, element, bpmnFactory, translate);
  DynamicSelectProps(generalGroup, element, bpmnFactory, translate);

  return [generalGroup];
}

export default function MagicPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {
  PropertiesActivator.call(this, eventBus);
  this.getTabs = function (element) {
    const gengralTab = {
      id: 'general',
      label: '基本信息',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    return [gengralTab];
  };
}

inherits(MagicPropertiesProvider, PropertiesActivator);
```




  [1]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/custom_property.png

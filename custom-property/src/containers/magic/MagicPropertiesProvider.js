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

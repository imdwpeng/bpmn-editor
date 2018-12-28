import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

const options = [
  { name: 'html', value: 'html' },
  { name: 'js', value: 'js' },
  { name: 'css', value: 'css' }
];

function getSelect(element) {
  const bo = getBusinessObject(element);
  const selectedOption = bo.get('camunda:customSelect');

  return selectedOption;
}

function setSelect(element, value) {
  const obj = {};
  obj['camunda:customSelect'] = value.customSelect;

  return obj;
}

export default function (group, element, bpmnFactory, translate) {
  const selectGroup = entryFactory.selectBox({
    id: 'customSelect',
    label: translate('自定义下拉框'),
    selectOptions: options,
    modelProperty: 'customSelect',
    get(el) {
      return {
        customSelect: getSelect(el)
      };
    },
    set(el, value) {
      const bo = getBusinessObject(el);
      const props = setSelect(el, value);

      return cmdHelper.updateBusinessObject(element, bo, props);
    }
  });

  group.entries.push(selectGroup);
}

'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is;

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var asyncCapableHelper = require('bpmn-js-properties-panel/lib/helper/AsyncCapableHelper');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

function isAsyncBefore(bo) {
  return asyncCapableHelper.isAsyncBefore(bo);
}

function isAsyncAfter(bo) {
  return asyncCapableHelper.isAsyncAfter(bo);
}

function getFailedJobRetryTimeCycle(bo) {
  return asyncCapableHelper.getFailedJobRetryTimeCycle(bo);
}

function removeFailedJobRetryTimeCycle(bo, element) {
  return asyncCapableHelper.removeFailedJobRetryTimeCycle(bo, element);
}

function createExtensionElements(parent, bpmnFactory) {
  return elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, parent, bpmnFactory);
}

function createFailedJobRetryTimeCycle(parent, bpmnFactory, cycle) {
  return elementHelper.createElement('camunda:FailedJobRetryTimeCycle', { body: cycle }, parent, bpmnFactory);
}

module.exports = function(group, element, bpmnFactory, translate) {

  var retryTimeCycleEntry = entryFactory.textField({
    id: 'retryTimeCycle',
    label: translate('Retry Time Cycle'),
    modelProperty: 'cycle',

    get: function(element, node) {
      var retryTimeCycle = getFailedJobRetryTimeCycle(getBusinessObject(element));
      var value = retryTimeCycle && retryTimeCycle.get('body');
      return {
        cycle: value
      };
    },

    set: function(element, values, node) {
      var newCycle = values.cycle;
      var bo = getBusinessObject(element);

      if (newCycle === '' || typeof newCycle === 'undefined') {
        // remove retry time cycle element(s)
        return removeFailedJobRetryTimeCycle(bo, element);
      }

      var retryTimeCycle = getFailedJobRetryTimeCycle(bo);

      if (!retryTimeCycle) {
        // add new retry time cycle element
        var commands = [];

        var extensionElements = bo.get('extensionElements');
        if (!extensionElements) {
          extensionElements = createExtensionElements(bo, bpmnFactory);
          commands.push(cmdHelper.updateBusinessObject(element, bo, { extensionElements: extensionElements }));
        }

        retryTimeCycle = createFailedJobRetryTimeCycle(extensionElements, bpmnFactory, newCycle);
        commands.push(cmdHelper.addAndRemoveElementsFromList(
          element,
          extensionElements,
          'values',
          'extensionElements',
          [ retryTimeCycle ],
          []
        ));

        return commands;
      }

      // update existing retry time cycle element
      return cmdHelper.updateBusinessObject(element, retryTimeCycle, { body: newCycle });
    },

    // hidden: function(element) {
    //   var bo = getBusinessObject(element);

    //   if (bo && (isAsyncBefore(bo) || isAsyncAfter(bo))) {
    //     return false;
    //   }

    //   if (is(element, 'bpmn:Event')) {
    //     return !eventDefinitionHelper.getTimerEventDefinition(element);
    //   }

    //   return true;
    // }

  });

  group.entries.push(retryTimeCycleEntry);

};

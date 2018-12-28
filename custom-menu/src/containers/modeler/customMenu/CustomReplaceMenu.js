import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isEventSubProcess,
  isExpanded
} from 'bpmn-js/lib/util/DiUtil';


import {
  isDifferentType
} from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

import {
  forEach,
  filter
} from 'min-dash';

import * as replaceOptions from './CustomReplaceOptions';


/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ReplaceMenuProvider(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
  this.popupMenu = popupMenu;
  this.modeling = modeling;
  this.moddle = moddle;
  this.bpmnReplace = bpmnReplace;
  this.rules = rules;
  this.translate = translate;

  this.register();
}

ReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];


/**
 * Register replace menu provider in the popup menu
 */
ReplaceMenuProvider.prototype.register = function () {
  this.popupMenu.registerProvider('bpmn-replace', this);
};


/**
 * Get all entries from replaceOptions for the given element and apply filters
 * on them. Get for example only elements, which are different from the current one.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getEntries = function (element) {
  const { businessObject } = element;

  const { rules } = this;

  let entries;

  if (!rules.allowed('shape.replace', { element })) {
    return [];
  }

  const differentType = isDifferentType(element);

  // start events outside event sub processes
  if (is(businessObject, 'bpmn:StartEvent') && !isEventSubProcess(businessObject.$parent)) {
    entries = filter(replaceOptions.START_EVENT, differentType);

    return this.createEntries(element, entries);
  }

  // expanded/collapsed pools
  if (is(businessObject, 'bpmn:Participant')) {
    entries = filter(replaceOptions.PARTICIPANT, (entry) => {
      return isExpanded(businessObject) !== entry.target.isExpanded;
    });

    return this.createEntries(element, entries);
  }

  // start events inside event sub processes
  if (is(businessObject, 'bpmn:StartEvent') && isEventSubProcess(businessObject.$parent)) {
    entries = filter(replaceOptions.EVENT_SUB_PROCESS_START_EVENT, (entry) => {
      const { target } = entry;

      const isInterrupting = target.isInterrupting !== false;

      const isInterruptingEqual = getBusinessObject(element).isInterrupting === isInterrupting;

      // filters elements which types and event definition are equal but have have different interrupting types
      return differentType(entry) || (!differentType(entry) && !isInterruptingEqual);
    });

    return this.createEntries(element, entries);
  }

  // end events
  if (is(businessObject, 'bpmn:EndEvent')) {
    entries = filter(replaceOptions.END_EVENT, (entry) => {
      const { target } = entry;

      // hide cancel end events outside transactions
      if (target.eventDefinitionType === 'bpmn:CancelEventDefinition' && !is(businessObject.$parent, 'bpmn:Transaction')) {
        return false;
      }

      return differentType(entry);
    });

    return this.createEntries(element, entries);
  }

  // boundary events
  if (is(businessObject, 'bpmn:BoundaryEvent')) {
    entries = filter(replaceOptions.BOUNDARY_EVENT, (entry) => {
      const { target } = entry;

      if (target.eventDefinition === 'bpmn:CancelEventDefinition'
         && !is(businessObject.attachedToRef, 'bpmn:Transaction')) {
        return false;
      }
      const cancelActivity = target.cancelActivity !== false;

      const isCancelActivityEqual = businessObject.cancelActivity === cancelActivity;

      return differentType(entry) || (!differentType(entry) && !isCancelActivityEqual);
    });

    return this.createEntries(element, entries);
  }

  // intermediate events
  if (is(businessObject, 'bpmn:IntermediateCatchEvent')
      || is(businessObject, 'bpmn:IntermediateThrowEvent')) {
    entries = filter(replaceOptions.INTERMEDIATE_EVENT, differentType);

    return this.createEntries(element, entries);
  }

  // gateways
  if (is(businessObject, 'bpmn:Gateway')) {
    entries = filter(replaceOptions.GATEWAY, differentType);

    return this.createEntries(element, entries);
  }

  // transactions
  if (is(businessObject, 'bpmn:Transaction')) {
    entries = filter(replaceOptions.TRANSACTION, differentType);

    return this.createEntries(element, entries);
  }

  // expanded event sub processes
  if (isEventSubProcess(businessObject) && isExpanded(businessObject)) {
    entries = filter(replaceOptions.EVENT_SUB_PROCESS, differentType);

    return this.createEntries(element, entries);
  }

  // expanded sub processes
  if (is(businessObject, 'bpmn:SubProcess') && isExpanded(businessObject)) {
    entries = filter(replaceOptions.SUBPROCESS_EXPANDED, differentType);

    return this.createEntries(element, entries);
  }

  // collapsed ad hoc sub processes
  if (is(businessObject, 'bpmn:AdHocSubProcess') && !isExpanded(businessObject)) {
    entries = filter(replaceOptions.TASK, (entry) => {
      const { target } = entry;

      const isTargetSubProcess = target.type === 'bpmn:SubProcess';

      const isTargetExpanded = target.isExpanded === true;

      return isDifferentType(element, target) && (!isTargetSubProcess || isTargetExpanded);
    });

    return this.createEntries(element, entries);
  }

  // sequence flows
  if (is(businessObject, 'bpmn:SequenceFlow')) {
    return this.createSequenceFlowEntries(element, replaceOptions.SEQUENCE_FLOW);
  }

  // flow nodes
  if (is(businessObject, 'bpmn:FlowNode')) {
    entries = filter(replaceOptions.TASK, differentType);

    // collapsed SubProcess can not be replaced with itself
    if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(businessObject)) {
      entries = filter(entries, (entry) => {
        return entry.label !== 'Sub Process (collapsed)';
      });
    }

    return this.createEntries(element, entries);
  }

  return [];
};


/**
 * Get a list of header items for the given element. This includes buttons
 * for multi instance markers and for the ad hoc marker.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getHeaderEntries = function (element) {
  let headerEntries = [];

  if (is(element, 'bpmn:Activity') && !isEventSubProcess(element)) {
    headerEntries = headerEntries.concat(this.getLoopEntries(element));
  }

  if (is(element, 'bpmn:SubProcess')
      && !is(element, 'bpmn:Transaction')
      && !isEventSubProcess(element)) {
    headerEntries.push(this.getAdHocEntryz(element));
  }

  return headerEntries;
};


/**
 * Creates an array of menu entry objects for a given element and filters the replaceOptions
 * according to a filter function.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype.createEntries = function (element, options) {
  const menuEntries = [];

  const self = this;

  forEach(options, (definition) => {
    const entry = self.createMenuEntry(definition, element);

    menuEntries.push(entry);
  });

  return menuEntries;
};

/**
 * Creates an array of menu entry objects for a given sequence flow.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions

 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype.createSequenceFlowEntries = function (element, options) {
  const businessObject = getBusinessObject(element);

  const menuEntries = [];

  const { modeling, moddle } = this;

  const self = this;

  forEach(options, (entry) => {
    switch (entry.actionName) {
      case 'replace-with-default-flow':
        if (businessObject.sourceRef.default !== businessObject
            && (is(businessObject.sourceRef, 'bpmn:ExclusiveGateway')
             || is(businessObject.sourceRef, 'bpmn:InclusiveGateway')
             || is(businessObject.sourceRef, 'bpmn:ComplexGateway')
             || is(businessObject.sourceRef, 'bpmn:Activity'))) {
          menuEntries.push(self.createMenuEntry(entry, element, () => {
            modeling.updateProperties(element.source, { default: businessObject });
          }));
        }
        break;
      case 'replace-with-conditional-flow':
        if (!businessObject.conditionExpression && is(businessObject.sourceRef, 'bpmn:Activity')) {
          menuEntries.push(self.createMenuEntry(entry, element, () => {
            const conditionExpression = moddle.create('bpmn:FormalExpression', { body: '' });

            modeling.updateProperties(element, { conditionExpression });
          }));
        }
        break;
      default:
      // default flows
        if (is(businessObject.sourceRef, 'bpmn:Activity') && businessObject.conditionExpression) {
          return menuEntries.push(self.createMenuEntry(entry, element, () => {
            modeling.updateProperties(element, { conditionExpression: undefined });
          }));
        }
        // conditional flows
        if ((is(businessObject.sourceRef, 'bpmn:ExclusiveGateway')
           || is(businessObject.sourceRef, 'bpmn:InclusiveGateway')
           || is(businessObject.sourceRef, 'bpmn:ComplexGateway')
           || is(businessObject.sourceRef, 'bpmn:Activity'))
           && businessObject.sourceRef.default === businessObject) {
          return menuEntries.push(self.createMenuEntry(entry, element, () => {
            modeling.updateProperties(element.source, { default: undefined });
          }));
        }
    }
  });

  return menuEntries;
};


/**
 * Creates and returns a single menu entry item.
 *
 * @param  {Object} definition a single replace options definition object
 * @param  {djs.model.Base} element
 * @param  {Function} [action] an action callback function which gets called when
 *                             the menu entry is being triggered.
 *
 * @return {Object} menu entry item
 */
ReplaceMenuProvider.prototype.createMenuEntry = function (definition, element, action) {
  const { translate } = this;
  const { replaceElement } = this.bpmnReplace;

  const replaceAction = function () {
    return replaceElement(element, definition.target);
  };

  action = action || replaceAction;

  const menuEntry = {
    label: translate(definition.label),
    className: definition.className,
    id: definition.actionName,
    action
  };

  return menuEntry;
};

/**
 * Get a list of menu items containing buttons for multi instance markers
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype.getLoopEntries = function (element) {
  const self = this;
  const { translate } = this;

  function toggleLoopEntry(event, entry) {
    let loopCharacteristics;

    if (entry.active) {
      loopCharacteristics = undefined;
    } else {
      loopCharacteristics = self.moddle.create(entry.options.loopCharacteristics);

      if (entry.options.isSequential) {
        loopCharacteristics.isSequential = entry.options.isSequential;
      }
    }
    self.modeling.updateProperties(element, { loopCharacteristics });
  }

  const businessObject = getBusinessObject(element);
  const { loopCharacteristics } = businessObject;

  let isSequential;
  let isLoop;
  let isParallel;

  if (loopCharacteristics) {
    isSequential = loopCharacteristics && loopCharacteristics.isSequential;
    isLoop = loopCharacteristics.isSequential === undefined;
    isParallel = loopCharacteristics.isSequential !== undefined && !loopCharacteristics.isSequential;
  }


  const loopEntries = [
    {
      id: 'toggle-parallel-mi',
      className: 'bpmn-icon-parallel-mi-marker',
      title: translate('Parallel Multi Instance'),
      active: isParallel,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
        isSequential: false
      }
    },
    {
      id: 'toggle-sequential-mi',
      className: 'bpmn-icon-sequential-mi-marker',
      title: translate('Sequential Multi Instance'),
      active: isSequential,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
        isSequential: true
      }
    },
    {
      id: 'toggle-loop',
      className: 'bpmn-icon-loop-marker',
      title: translate('Loop'),
      active: isLoop,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:StandardLoopCharacteristics'
      }
    }
  ];
  return loopEntries;
};


/**
 * Get the menu items containing a button for the ad hoc marker
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} a menu item
 */
ReplaceMenuProvider.prototype.getAdHocEntryz = function (element) {
  const { translate } = this;
  const businessObject = getBusinessObject(element);

  const isAdHoc = is(businessObject, 'bpmn:AdHocSubProcess');

  const { replaceElement } = this.bpmnReplace;

  const adHocEntry = {
    id: 'toggle-adhoc',
    className: 'bpmn-icon-ad-hoc-marker',
    title: translate('Ad-hoc'),
    active: isAdHoc,
    action() {
      if (isAdHoc) {
        return replaceElement(element, { type: 'bpmn:SubProcess' });
      } else {
        return replaceElement(element, { type: 'bpmn:AdHocSubProcess' });
      }
    }
  };

  return adHocEntry;
};

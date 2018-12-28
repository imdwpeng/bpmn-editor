import {
  assign
} from 'min-dash';

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider(palette, create, elementFactory, spaceTool, lassoTool, handTool, translate) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.spaceTool = spaceTool;
  this.lassoTool = lassoTool;
  this.handTool = handTool;
  this.translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function () {
  const actions = [];
  const { create, elementFactory, translate } = this;

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      const shape = elementFactory.createShape(assign({ type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    const shortType = type.replace(/^bpmn:/, '');

    return {
      group,
      className,
      title: translate(title || 'Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  assign(actions, [
    {
      title: translate('Start Events'),
      group: 'startEvents',
      children: [
        {
          id: 'create.start-event',
          ...createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none')
        }
      ]
    },
    {
      title: translate('Intermediate Events'),
      group: 'intermediateEvents',
      children: [
        {
          id: 'create.intermediate-event',
          ...createAction('bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none')
        },
        {
          id: 'create.intermediate-event-catch-timer',
          ...createAction('bpmn:IntermediateCatchEvent', 'event', 'bpmn-icon-intermediate-event-catch-timer', 'Intermediate Event Catch Timer', { eventDefinitionType: 'bpmn:TimerEventDefinition' })
        }
      ]
    },
    {
      title: translate('Boundary Events'),
      group: 'boundaryEvents',
      children: [
        {
          id: 'create.boundary-event-catch-timer',
          ...createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-timer', 'Boundary Event Timer', { eventDefinitionType: 'bpmn:TimerEventDefinition' })
        }
      ]
    },
    {
      title: translate('End Events'),
      group: 'endEvents',
      children: [
        {
          id: 'create.end-event',
          ...createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none')
        }
      ]
    },
    {
      title: translate('Activities'),
      group: 'activities',
      children: [
        {
          id: 'create.task',
          ...createAction('bpmn:Task', 'activity', 'bpmn-icon-task')
        },
        {
          id: 'create.userTask',
          ...createAction('bpmn:UserTask', 'activity', 'bpmn-icon-user-task')
        },
        {
          id: 'create.serviceTask',
          ...createAction('bpmn:ServiceTask', 'activity', 'bpmn-icon-service-task')
        }
      ]
    },
    {
      title: translate('Gateways'),
      group: 'gateways',
      children: [
        {
          id: 'create.exclusive-gateway',
          ...createAction('bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor')
        },
        {
          id: 'create.parallel-gateway',
          ...createAction('bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel')
        }
      ]
    }
  ]);

  return actions;
};

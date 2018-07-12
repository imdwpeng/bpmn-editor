import {
  assign
} from 'min-dash';


/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider(palette, create, elementFactory, spaceTool, lassoTool, handTool) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.spaceTool = spaceTool;
  this.lassoTool = lassoTool;
  this.handTool = handTool;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool'
];


PaletteProvider.prototype.getPaletteEntries = function () {
  const actions = {};
  const { create, elementFactory, lassoTool, handTool } = this;

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
      title: title || `Create ${shortType}`,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  // function createParticipant(event, collapsed) {
  //   create.start(event, elementFactory.createParticipantShape(collapsed));
  // }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: 'Activate the hand tool',
      action: {
        click(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Activate the lasso tool',
      action: {
        click(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    // 'space-tool': {
    //   group: 'tools',
    //   className: 'bpmn-icon-space-tool',
    //   title: 'Activate the create/remove space tool',
    //   action: {
    //     click: function(event) {
    //       spaceTool.activateSelection(event);
    //     }
    //   }
    // },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
    ),
    // 'create.intermediate-event': createAction(
    //   'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none'
    // ),
    // 'create.end-event': createAction(
    //   'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none'
    // ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task'
    )
    // 'create.subprocess-expanded': createAction(
    //   'bpmn:SubProcess', 'activity', 'bpmn-icon-subprocess-expanded', 'Create expanded SubProcess',
    //   { isExpanded: true }
    // ),
    // 'create.participant-expanded': {
    //   group: 'collaboration',
    //   className: 'bpmn-icon-participant',
    //   title: 'Create Pool/Participant',
    //   action: {
    //     dragstart: createParticipant,
    //     click: createParticipant
    //   }
    // }
  });

  return actions;
};

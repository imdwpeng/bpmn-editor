import { assign } from 'min-dash';
import inherits from 'inherits';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isExpanded } from 'bpmn-js/lib/util/DiUtil';
import BpmnElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import { DEFAULT_LABEL_SIZE } from 'bpmn-js/lib/util/LabelUtil';

/**
 * A custom factory that knows how to create BPMN _and_ custom elements.
 */
export default function CustomElementFactory(bpmnFactory, moddle) {
  BpmnElementFactory.call(this, bpmnFactory, moddle);

  const self = this;

  /**
   * Create a diagram-js element with the given type (any of shape, connection, label).
   *
   * @param  {String} elementType
   * @param  {Object} attrs
   *
   * @return {djs.model.Base}
   */
  this.create = function (elementType, attrs) {
    if (elementType === 'label') {
      return self.baseCreate(elementType, assign({ type: 'label' }, DEFAULT_LABEL_SIZE, attrs));
    }

    return self.createBpmnElement(elementType, attrs);
  };
}

inherits(CustomElementFactory, BpmnElementFactory);

CustomElementFactory.$inject = [
  'bpmnFactory',
  'moddle'
];


/**
 * Returns the default size of custom shapes.
 *
 * The following example shows an interface on how
 * to setup the custom shapes's dimensions.
 *
 * @example
 *
 * var shapes = {
 *   triangle: { width: 40, height: 40 },
 *   rectangle: { width: 100, height: 20 }
 * };
 *
 * return shapes[type];
 *
 *
 * @param {object} params
 *
 * @return {Dimensions} a {width, height} object representing the size of the element
 */
CustomElementFactory.prototype._getDefaultSize = function (semantic) {
  const shapes = {
    __default: { width: 100, height: 80 },
    'bpmn:Event': { width: 36, height: 36 },
    'bpmn:Task': { width: 80, height: 80 },
    'bpmn:Gateway': { width: 50, height: 50 },
    'bpmn:Lane': { width: 400, height: 100 },
    'bpmn:DataObjectReference': { width: 36, height: 50 },
    'bpmn:DataStoreReference': { width: 50, height: 50 },
    'bpmn:TextAnnotation': { width: 100, height: 30 }
  };

  let size = '';
  for (const i in shapes) {
    if (is(semantic, i)) {
      size = shapes[i];
    }
  }

  if (is(semantic, 'bpmn:SubProcess')) {
    if (isExpanded(semantic)) {
      size = { width: 350, height: 200 };
    } else {
      size = { width: 100, height: 80 };
    }
  }

  if (is(semantic, 'bpmn:Participant')) {
    if (!isExpanded(semantic)) {
      size = { width: 400, height: 100 };
    } else {
      size = { width: 600, height: 250 };
    }
  }

  return size || shapes.__default;
};

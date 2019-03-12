import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import './FigureSource/CustomElements.scss';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';

import FigureSource from './FigureSource';

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles) {
  BaseRenderer.call(this, eventBus, 2000);

  const { computeStyle } = styles;

  /**
   * @param  {object} parent
   * @param  {string} type 主节点类型
   * @param  {string} definitionType 子节点类型
   * @param  {object} shape 样式
   */
  this.drawCustomShape = function (parent, type, definitionType, shape) {
    const iType = type.replace('bpmn:', '');
    const iDefinitionType = definitionType.replace('bpmn:', '');
    const key = iDefinitionType ? `${iType}.${iDefinitionType}` : iType;
    const url = FigureSource[key];
    if (!url) return;
    const catGfx = svgCreate('image', {
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      href: url
    });

    svgAppend(parent, catGfx);

    return catGfx;
  };

  this.getCustomShapePath = function (element) {
    const { x, y, width, height } = element;
    const shapePath = [
      ['M', x, y],
      ['l', width, 0],
      ['l', 0, height],
      ['l', -width, 0],
      ['z']
    ];

    return componentsToPath(shapePath);
  };

  this.drawCustomConnection = function (p, element) {
    const attrs = computeStyle('', {
      stroke: '#f00',
      strokeWidth: 2
    });

    return svgAppend(p, createLine(element.waypoints, attrs));
  };

  this.getCustomConnectionPath = function (connection) {
    const waypoints = connection.waypoints.map((p) => {
      return p.original || p;
    });

    const connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y]
    ];

    waypoints.forEach((waypoint, index) => {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ['eventBus', 'styles'];


CustomRenderer.prototype.canRender = function (element) {
  return /^bpmn:/.test(element.type);
};

CustomRenderer.prototype.drawShape = function (p, element) {
  const { type } = element;
  const bo = getBusinessObject(element);
  const definitionType = bo.eventDefinitions ? bo.eventDefinitions[0].$type : '';
  if (type === 'bpmn:StartEvent' || type === 'bpmn:EndEvent' || type === 'bpmn:UserTask' || type === 'bpmn:ServiceTask') {
    return this.drawCustomShape(
      p,
      type,
      definitionType,
      {
        width: element.width,
        height: element.height
      }
    );
  }
};

CustomRenderer.prototype.getShapePath = function (shape) {
  const { type } = shape;

  if (type === 'bpmn:StartEvent' || type === 'bpmn:EndEvent' || type === 'bpmn:UserTask' || type === 'bpmn:ServiceTask') {
    return this.getCustomShapePath(shape);
  }
};

CustomRenderer.prototype.drawConnection = function (p, element) {
  const { type } = element;

  if (type === 'bpmn:SequenceFlow') {
    return this.drawCustomConnection(p, element);
  }
};

CustomRenderer.prototype.getConnectionPath = function (connection) {
  const { type } = connection;

  if (type === 'bpmn:SequenceFlow') {
    return this.getCustomConnectionPath(connection);
  }
};

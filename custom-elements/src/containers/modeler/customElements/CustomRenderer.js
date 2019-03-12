import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import TextUtil from 'diagram-js/lib/util/Text';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil';
import {
  append as svgAppend,
  create as svgCreate,
  classes as svgClasses
} from 'tiny-svg';

import FigureSource from './FigureSource';
import './FigureSource/CustomElements.scss';

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles) {
  BaseRenderer.call(this, eventBus, 2000);

  const defaultStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 1.2
  };

  const textUtil = new TextUtil({
    style: defaultStyle
  });

  const { computeStyle } = styles;

  /**
   * @param  {object} parent
   * @param  {string} type 主节点类型
   * @param  {string} definitionType 子节点类型
   * @param  {object} shape 样式
   */
  this.drawCustomShape = function (parent, element, type, definitionType, shape) {
    const bo = getBusinessObject(element);
    const iType = type.replace('bpmn:', '');
    const iDefinitionType = definitionType.replace('bpmn:', '');
    const key = iDefinitionType ? `${iType}.${iDefinitionType}` : iType;
    const url = FigureSource[key];
    const options = {
      size: {
        width: 100
      },
      align: 'center-middle',
      box: element,
      padding: 5
    };

    if (!url) return;

    const customEl = svgCreate('image', {
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      href: url
    });

    svgAppend(parent, customEl);

    // 显示节点名称
    if (!is(element, 'bpmn:Event')) {
      const text = textUtil.createText(bo.name || '', options || {});
      svgClasses(text).add('djs-label');
      svgAppend(parent, text);
    }

    return customEl;
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
  return this.drawCustomShape(
    p,
    element,
    type,
    definitionType,
    {
      width: element.width,
      height: element.height
    }
  );
};

CustomRenderer.prototype.getShapePath = function (shape) {
  return this.getCustomShapePath(shape);
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

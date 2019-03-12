import CustomRenderer from './CustomRenderer';
import CustomElementFactory from './CustomElementFactory';

export default {
  __init__: [
    'customRenderer'
  ],
  customRenderer: ['type', CustomRenderer],
  elementFactory: ['type', CustomElementFactory]
};

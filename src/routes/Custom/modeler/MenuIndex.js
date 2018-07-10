import Modeler from 'bpmn-js/lib/Modeler';

import inherits from 'inherits';

import CustomMenu from './customMenu';

export default function CustomModeler(options) {
  Modeler.call(this, options);

  this.customElements = [];
}

inherits(CustomModeler, Modeler);

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [
    CustomMenu
  ]
);

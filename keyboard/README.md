# Keyboard

------

## import custom modeler && enable keyboard shortcuts

```js
// import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnModeler from './modeler';

this.bpmnModeler = new BpmnModeler({
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties-panel'
  },
  additionalModules: [propertiesPanelModule, propertiesProviderModule],
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  },
  keyboard: { bindTo: document } //enable keyboard shortcuts
});
```

## set custom keyboard

eg. add cut keyboard shortcuts
```js
export default function BpmnKeyBindings(keyboard, editorActions) {
  keyboard.addListener((key) => {
    // cut
    // ctrl x
    if (key === 88) {
      editorActions.trigger('copy');
      editorActions.trigger('removeSelection');
      return true;
    }
  });
}

BpmnKeyBindings.$inject = [
  'keyboard',
  'editorActions'
];
```

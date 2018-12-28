/**
 * BPMN 2.0 specific key bindings.
 *
 * @param {Keyboard} keyboard
 * @param {EditorActions} editorActions
 */
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

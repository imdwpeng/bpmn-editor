# Custom Toolbar

------

![此处输入图片的描述][1]

## import custom toolbar components and set events of toolbar

```js
import EditingTools from '../components/EditingTools';

...
// eg. save
handleSave = () => {
  this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
    console.log(xml);
  });
};
...

// render toolbar
<EditingTools
  onOpenFIle={this.handleOpenFile}
  onSave={this.handleSave}
  onUndo={this.handleUndo}
  onRedo={this.handleRedo}
  onDownloadSvg={this.handleDownloadSvg}
  onDownloadXml={this.handleDownloadXml}
  onZoomIn={() => this.handleZoom(0.1)}
  onZoomOut={() => this.handleZoom(-0.1)}
  onZoomReset={() => this.handleZoom()}
/>
```

## set component of toolbar




  [1]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/custom_toolbar.png

# BPMN Editor

[演示实例][18]

基于 [bpmn-js][1] ，举例展示如何在react项目中使用 bpmn-js 进行流程设计。

## 目录

* [用法](#用法)
  * [基本用法](#基本用法)
  * [属性栏](#属性栏)
  * [操作栏](#操作栏)
* [私人定制](#私人定制)
  * [定制属性栏](#定制属性栏)
    * [常规属性](#常规属性)
    * [区分任务](#区分任务)
    * [动态数据](#动态数据)
  * [定制工具栏](#定制工具栏)
  * [定制菜单项](#定制菜单项)
* [国际化](#国际化)
* [节点](#节点)
  * [元素](#元素)
  * [任务](#任务)

## 用法

### 基本用法

![此处输入图片的描述][2]

安装依赖：
```
npm install bpmn-js -s
```

```js
import BpmnModeler from 'bpmn-js/lib/Modeler';

this.bpmnModeler = new BpmnModeler({
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties-panel'
  }
});

this.bpmnModeler.importXML(diagramXML, (err) => {
  if (err) {
    console.log('导入失败');
  } else {
    console.log('导入成功');
  }
})

<div>
    <div id="canvas"></div>
    <div id="properties-panel"></div>
</div>
```
[完整代码][3]

### 属性栏

![此处输入图片的描述][4]

安装依赖：
```
npm install bpmn-js-properties-panel camunda-bpmn-moddle -s
```

```js
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';

this.bpmnModeler = new BpmnModeler({
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties-panel'
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
});

<div>
    <div id="canvas"></div>
    <div id="properties-panel"></div>
</div>
```
[完整代码][5]

### 操作栏

![此处输入图片的描述][6]

```js
import EditingTools from './EditingTools';

/**
 * 下载xml/svg
 *  @param  type  类型  svg / xml
 *  @param  data  数据
 *  @param  name  文件名称
 */
download = (type, data, name) => {
    let dataTrack = '';
    const a = document.createElement('a');
    
    switch (type) {
      case 'xml':
        dataTrack = 'bpmn';
        break;
      case 'svg':
        dataTrack = 'svg';
        break;
      default:
        break;
    }
    
    name = name || `diagram.${dataTrack}`;
    
    a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
    a.setAttribute('download', name);
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 导入xml文件
handleOpenFile = (e) => {
    const that = this;
    const file = e.target.files[0];
    const reader = new FileReader();
    let data = '';
    reader.readAsText(file);
    reader.onload = function (event) {
      data = event.target.result;
      that.renderDiagram(data, 'open');
    };
}

// 保存
handleSave = () => {
    this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
      console.log(xml);
    });
};

// 前进
handleRedo = () => {
    this.bpmnModeler.get('commandStack').redo();
};

// 后退
handleUndo = () => {
    this.bpmnModeler.get('commandStack').undo();
};

// 下载SVG格式
handleDownloadSvg = () => {
    this.bpmnModeler.saveSVG({ format: true }, (err, data) => {
      this.download('svg', data);
    });
}

// 下载XML格式
handleDownloadXml = () => {
    this.bpmnModeler.saveXML({ format: true }, (err, data) => {
      this.download('xml', data);
    });
}

// 流程图放大缩小
handleZoom = (radio) => {
    const newScale = !radio
      // 不输入radio则还原
      ? 1.0
      // 最小缩小倍数
      : this.state.scale + radio <= 0.2
        ? 0.2
        : this.state.scale + radio;
    
    this.bpmnModeler.get('canvas').zoom(newScale);
    this.setState({
      scale: newScale
    });
}

<div>
    <div id="canvas"></div>
    <div id="properties-panel"></div>
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
</div>
```

`EditingTools.js`
```js
import React, { Component } from 'react';
import styles from './index.less';

class EditingTools extends Component {
  handleOpen = () => {
    this.file.click();
  }

  render() {
    const {
      onOpenFIle,
      onZoomIn,
      onZoomOut,
      onZoomReset,
      onUndo,
      onRedo,
      onSave,
      onDownloadXml,
      onDownloadSvg
    } = this.props;
    return (
      <div className={styles.editingTools}>
        <ul className={styles.controlList}>
          <li className={`${styles.control} ${styles.line}`}>
            <input ref={(file) => { this.file = file; }} className={styles.openFile} type="file" onChange={onOpenFIle} />
            <button title="open" onClick={this.handleOpen}>
              <i className={styles.open} />
            </button>
          </li>

          <li className={styles.control}>
            <button title="undo" onClick={onUndo}>
              <i className={styles.undo} />
            </button>
          </li>
          <li className={`${styles.control} ${styles.line}`}>
            <button title="redo" onClick={onRedo}>
              <i className={styles.redo} />
            </button>
          </li>

          <li className={styles.control}>
            <button title="reset zoom" onClick={onZoomReset}>
              <i className={styles.zoom} />
            </button>
          </li>
          <li className={styles.control}>
            <button title="zoom in" onClick={onZoomIn}>
              <i className={styles.zoomIn} />
            </button>
          </li>
          <li className={`${styles.control} ${styles.line}`}>
            <button title="zoom out" onClick={onZoomOut}>
              <i className={styles.zoomOut} />
            </button>
          </li>

          <li className={styles.control}>
            <button title="save" onClick={onSave}>
              <i className={styles.save} />
            </button>
          </li>
          <li className={styles.control}>
            <button title="download bpmn diagram" onClick={onDownloadXml}>
              <i className={styles.download} />
            </button>
          </li>
          <li className={styles.control}>
            <button title="download as svg image" onClick={onDownloadSvg}>
              <i className={styles.image} />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default EditingTools;
```
[完整代码][7]

## 私人定制

### 定制属性栏

在使用过程中，我们一般会根据具体需求定制属性栏。

#### 常规属性

![此处输入图片的描述][8]

首先，新建目录:

```
/magic
|- index.js // Modal入口
|- MagicPropertiesProvider.js // Modal配置
|- /parts // 自定义属性
    |- InputTxtProps.js
    |- ...
```

然后，更换 `propertiesProviderModule` ，改成我们自定义的 `Modal` :

```js
- import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
+ import propertiesProviderModule from './magic';
```

创建自定义 `Modal` 入口 `magic/index.js` :

```js
import MagicPropertiesProvider from './MagicPropertiesProvider';

export default {
  __init__: [ 'propertiesProvider' ],
  propertiesProvider: [ 'type', MagicPropertiesProvider ]
}
```

配置 `Modal` 相关属性 `magic/MagicPropertiesProvider.js` :

```js
import inherits from 'inherits';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

import inputTxtProps from './parts/InputTxtProps';

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {
  const generalGroup = {
    id: 'general',
    label: '',
    entries: []
  };

  inputTxtProps(generalGroup, element, bpmnFactory, translate);

  return [generalGroup];
}

export default function MagicPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {
  PropertiesActivator.call(this, eventBus);
  this.getTabs = function (element) {
    const gengralTab = {
      id: 'general',
      label: '基本信息',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    return [gengralTab];
  }
}

inherits(MagicPropertiesProvider, PropertiesActivator);
```

自定义属性 `magic/parts/InputTxtProps.js` :

```js
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

export default function (group, element, bpmnFactory, translate) {

  group.entries.push(entryFactory.textField({
    id: 'customTxt',
    label: translate('自定义输入框'),
    modelProperty: 'camunda:customTxt'
  }));
}
```

#### 区分任务

![此处输入图片的描述][9]

我们还可以根据不同任务角色进行不同属性的配置，如本例中只在用户任务（UserTask）下才展示用户任务输入框。

`magic/parts/UserCustomProps.js` :

```js
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import { is } from 'bpmn-js/lib/util/ModelUtil';

export default function (group, element, bpmnFactory, translate) {
  if(!is(element, 'bpmn:UserTask')) return;

  group.entries.push(entryFactory.textField({
    id: 'userCustom',
    label: translate('用户任务'),
    modelProperty: 'camunda:userCustom'
  }));
}
```

具体任务节点名称见 [节点](#节点) 介绍。

#### 动态数据

![此处输入图片的描述][10]

很多时候，我们会根据不同的选择，联动地向后端请求数据来展示另一个选择列表。

本例中用到两个新的依赖：

```
npm install -s lodash min-dom
```

`magic/parts/DynamicSelectProps.js` :

```js
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { query, domify, attr } from 'min-dom/dist';
import { forEach } from 'lodash/collection';

function getData(ms){
  return new Promise((resolve,reject)=>{
    setTimeout(resolve,ms,{val:1});
  })
}

function getSelectBox(node) {
  return query('select[name=dynamicSelect]', node.parentElement);
}

function getSelect(element) {
  const bo = getBusinessObject(element);
  const selectedOption = bo.get('camunda:dynamicSelect');

  return selectedOption;
}

function setSelect(element, value) {
  let obj = {};
  obj['camunda:dynamicSelect'] = value.dynamicSelect;

  return obj;
}

export default function (group, element, bpmnFactory, translate) {
  const selectGroup = {
    id: 'dynamicSelect',
    html: '<div class="bpp-row bpp-select">' +
             '<label for="dynamic-select">动态获取列表</label>' +
             '<div class="bpp-field-wrapper">' +
               '<select id="dynamic-select" name="dynamicSelect" data-value>' +
               '</select>' +
               '<button class="get-data" id="addElement" data-action="addElement">获取数据</button>' +
             '</div>' +
          '</div>',
    get(el) {
      return {
        dynamicSelect: getSelect(el)
      }
    },
    set(el, value) {
      const bo = getBusinessObject(el);
      const props = setSelect(el, value);

      return cmdHelper.updateBusinessObject(element, bo, props);
    },
    addElement: function (element, inputNode, event, scopeNode) {
      getData(1000).then((value)=>{
        console.log('调用成功');
        
        const selectBox = getSelectBox(inputNode);

        forEach(selectBox, function(option, i) {
          selectBox.removeChild(selectBox.firstChild)
        });

        for(let i=0; i < 10; i++) {
          var optionTemplate = domify('<option value="' + i + '">' + i + '</option>');
          selectBox.insertBefore(optionTemplate, selectBox.firstChild);
        }

        forEach(selectBox, function(option) {
          if (option.value === 0) {
            attr(option, 'selected', 'selected');
          } else {
            attr(option, 'selected', null);
          }
        });
  
        return true;
      })
    }
  };

  group.entries.push(selectGroup);
}
```

[完整代码][11]

### 定制工具栏

![此处输入图片的描述][12]

新增目录：

```
/modeler
|- index.js // 入口
|- /customPalette // 工具栏
    |- index.js // 工具栏入口
    |- CustomPalette.js // 工具栏配置
```

首先，安装下新的依赖包：
```
npm install -s min-dash
```

然后，配置工具栏，配置我们需要的工具：
工具栏入口 `modeler/customPalette/index.js` :

```js
import CustomPalette from './CustomPalette';

export default {
  __init__: ['paletteProvider'],
  paletteProvider: ['type', CustomPalette]
};

```

工具栏具体配置 `modeler/customPalette/CustomPalette.js` :

```js
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
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task'
    )
  });

  return actions;
};
```

然后，设置总的入口 `modeler/index.js` :

```js
import Modeler from 'bpmn-js/lib/Modeler';

import inherits from 'inherits';

import CustomPalette from './customPalette';

export default function CustomModeler(options) {
  Modeler.call(this, options);

  this.customElements = [];
}

inherits(CustomModeler, Modeler);

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [
    CustomPalette
  ]
);
```

最后，将 `BpmnModeler` 的引用替换成我们自定义的 `Modeler` ：

```js
- import BpmnModeler from 'bpmn-js/lib/Modeler';
+ import BpmnModeler from './modeler';
```

[完整代码][13]

### 定制菜单项

![此处输入图片的描述][14]

新增目录：

```
/modeler
|- /customMenu // 菜单
    |- CustomReplaceMenu.js // 菜单设置
    |- CustomReplaceOptions.js // 菜单配置
    |- index.js // 菜单入口
```

具体操作同工具栏类似，这里代码就不贴出来了，可自行看源码。

[完整代码][15]

## 国际化

![此处输入图片的描述][16]

新增目录：

```
/modeler
|- /customTranslate
    |- CustomTranslate.js // 国际化设置
    |- TranslationsGerman.js // 国际化配置
    |- index.js // 国际化入口
```

具体操作同工具栏类似，这里代码就不贴出来了，可自行看源码。

[完整代码][17]

## 节点

### 元素

名称|标示
--|--
画布|bpmn:Process
判断|bpmn:SequenceFlow
开始|bpmn:StartEvent

### 任务

名称|标示
--|--
用户|bpmn:UserTask


  [1]: https://github.com/bpmn-io/bpmn-js
  [2]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_1.png
  [3]: https://github.com/imdwpeng/bpmn-editor/blob/dev/usage-basic/src/routes/Bpmn.js
  [4]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_2.png
  [5]: https://github.com/imdwpeng/bpmn-editor/blob/dev/usage-property/src/routes/Bpmn.js
  [6]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_3.png
  [7]: https://github.com/imdwpeng/bpmn-editor/blob/dev/usage-operate/src/routes/Bpmn.js
  [8]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_4.png
  [9]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_5.png
  [10]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_6.png
  [11]: https://github.com/imdwpeng/bpmn-editor/blob/dev/custom-property/src/routes/Bpmn.js
  [12]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_7.png
  [13]: https://github.com/imdwpeng/bpmn-editor/blob/dev/custom-toolbar/src/routes/Bpmn.js
  [14]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_8.png
  [15]: https://github.com/imdwpeng/bpmn-editor/blob/dev/custom-menu/src/routes/Bpmn.js
  [16]: https://raw.githubusercontent.com/imdwpeng/photoGallery/master/bpmn/bpmn_9.png
  [17]: https://github.com/imdwpeng/bpmn-editor/blob/dev/i18n/src/routes/Bpmn.js
  [18]: http://dwpblog.site/bpmn-editor/dist/index.html
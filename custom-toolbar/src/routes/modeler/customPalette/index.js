/*
 * @Author: Eric
 * @Date: 2018-06-07 13:19:34
 * @Last Modified by: Eric
 * @Last Modified time: 2018-06-07 13:20:02
 * @功能：自定义左侧面板
 */

import CustomPalette from './CustomPalette';

export default {
  __init__: ['paletteProvider'],
  paletteProvider: ['type', CustomPalette]
};

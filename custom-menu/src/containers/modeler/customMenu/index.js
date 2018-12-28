/*
 * @Author: Eric
 * @Date: 2018-06-07 13:20:24
 * @Last Modified by: Eric
 * @Last Modified time: 2018-06-07 13:20:44
 * @功能：自定义菜单中的条目
 */

import CustomReplaceMenu from './CustomReplaceMenu';

export default {
  __init__: ['replaceMenuProvider'],
  replaceMenuProvider: ['type', CustomReplaceMenu]
};

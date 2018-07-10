/*
 * @Author: Eric
 * @Date: 2018-06-07 13:18:30
 * @Last Modified by: Eric
 * @Last Modified time: 2018-06-07 13:19:13
 * @ 功能：自定义语言（i18n）
 */

import CustomTranslate from './CustomTranslate';

export default {
  __init__: ['translate'],
  translate: ['value', CustomTranslate]
};

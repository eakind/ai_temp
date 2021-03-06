import messageBox from './src/index.vue';

messageBox.install = function (Vue) {
  let Constructor = Vue.extend(messageBox);
  let ins = new Constructor();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.$showMessageBox = function ({
    title,
    secondTitle,
    placeHolder,
    message,
    contentHtml,
    showConfirmButton = true,
    confirmText = '确定',
    cancelText = '取消',
    center = false,
    inputObj = {},
    cb,
    cancel
  }) {
    ins.show = true;
    ins.title = title;
    ins.secondTitle = secondTitle;
    ins.placeHolder = placeHolder;
    ins.message = message;
    ins.contentHtml = contentHtml;
    ins.showConfirmButton = showConfirmButton;
    ins.confirmText = confirmText;
    ins.cancelText = cancelText;
    ins.center = center;
    ins.inputObj.show = inputObj.show === undefined ? false : inputObj.show;
    ins.inputObj.value = inputObj.value ? inputObj.value : '';
    ins.inputObj.inputPattern = inputObj.inputPattern ? inputObj.inputPattern : '';
    ins.inputObj.inputErrorText = inputObj.inputErrorText ? inputObj.inputErrorText : '';
    ins.inputObj.type = ins.inputObj.type ? ins.inputObj.type : 'text';
    ins.callBack = cb;
    ins.callBackCancel = cancel;
    return ins;
  };
  Vue.prototype.$closeMessageBox = function () {
    ins.show = false;
  };
};
export default messageBox;

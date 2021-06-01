import Vue from 'vue';
import {
  Select,
  Option,
  Message,
  MessageBox,
  InfiniteScroll,
  Collapse,
  CollapseItem,
  Radio,
  Checkbox,
  CheckboxGroup,
  Tabs,
  TabPane,
  Switch,
  Pagination,
  DatePicker,
  Drawer
} from 'element-ui';
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.use(Select);
Vue.use(Option);
Vue.use(InfiniteScroll);
Vue.component(CollapseTransition.name, CollapseTransition);

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(DatePicker);
Vue.use(Drawer);

Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$message = function (param) {
  Message.closeAll();
  Message(
    Object.assign(param, {
      duration: 1000
    })
  );
};

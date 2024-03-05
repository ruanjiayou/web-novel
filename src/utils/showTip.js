import { Modal } from 'antd-mobile';

export default function (router) {
  let handle = Modal.alert('提示', '请先登录!', [
    {
      text: '取消',
      onPress() {
        handle.close();
      },
    },
    {
      text: '登录',
      onPress() {
        router.pushView('novel/auth/login');
      },
    },
  ]);
}

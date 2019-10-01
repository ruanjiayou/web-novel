import React from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import LoadListView from '../../../components/ListLoad/index';
import { useContext } from '../../../contexts/routerContext/index';
import { Popover, SearchBar, Modal, InputItem, Toast, ActivityIndicator } from 'antd-mobile';
import Clipboard from 'react-clipboard.js';

import './List.css';
import MIcon from '../../../components/MIcon';
import store from '../../../global-state';
import services from '../../../services';

function RenderItem({ item, sectionId, router, remove, search, toggleLoading, edit }) {
  const store = useLocalStore(() => ({ open: false, dropdown: false }));
  return <Observer>
    {() => <div key={sectionId} className={'dd-code-item'} style={{ display: search === '' || item.name.toLowerCase().includes(search) || item.account.toLowerCase().includes(search) ? 'block' : 'none' }}>
      <div className="dd-common-alignside">
        <span style={{ flexGrow: 1 }} onClick={() => store.open = !store.open}>
          <MIcon type={store.open ? 'FaCaretDown' : 'FaCaretRight'} />
          {item.name}
        </span>
        <Popover
          visible={store.dropdown}
          mask
          onVisibleChange={visible => store.dropdown = visible}
          onSelect={() => store.dropdown = false}
          overlay={[
            <Popover.Item key="1"><span onClick={async () => {
              toggleLoading();
              const res = await services.getCodeVersions({ id: item.id, cid: item.cid });
              toggleLoading();
              if (res.code === 0) {
                Modal.alert('密码', res.data.map(v => `${v.password}`).join('  '));
              } else {
                Toast.info('请求错误');
              }
            }}>查看密码</span></Popover.Item>,
            <Popover.Item key="2"><span onClick={() => {
              Modal.prompt('修改', '', [{
                text: '取消',
              }, {
                text: '确定',
                onPress: async (value) => {
                  if (value === '') {
                    return;
                  }
                  const res = await services.createCodeVersion({ id: item.id, cid: item.id, password: value });
                  if (res.code === 0) {
                    Toast.info('修改成功');
                  } else {
                    Toast.info('修改失败');
                  }
                }
              }], 'default', '');
            }}>修改密码</span></Popover.Item>,
            <Popover.Item key="3"><span onClick={() => {
              edit(item);
            }}>修改信息</span></Popover.Item>,
            <Popover.Item key="0"><span onClick={remove}>删除账号</span></Popover.Item>,
          ]}
        >
          <MIcon style={{ marginRight: 5 }} type="FaEllipsisV" onClick={() => store.dropdown = !store.dropdown} />
        </Popover>

      </div>
      <div style={{ display: store.open ? 'block' : 'none', backgroundColor: '#eee' }}>
        <Clipboard
          onSuccess={() => { Toast.info('复制成功'); }}
          component='p'
          data-clipboard-text={item.account}
        >账号:{item.account}</Clipboard>
        <p>备注:{item.mark}</p>
      </div>
    </div>
    }
  </Observer>;
}

export default function ({ loader, className }) {
  const router = useContext();
  const lstore = useLocalStore(() => ({
    search: '',
    // 用户下拉菜单
    open: false,
    // 新建对话框
    modal: false,
    // 请求创建账号/删除账号
    loading: false,
    // 临时数据
    id: '',
    name: '',
    account: '',
    password: '',
    mark: '',
  }));
  return <Observer>
    {() => {
      return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="dd-common-alignside">
          <SearchBar
            style={{ width: '100%' }}
            value={lstore.search}
            placeholder={'查找'}
            onSubmit={() => { }}
            onClear={() => lstore.search = ''}
            onCancel={() => lstore.search = ''}
            // showCancelButton
            onChange={val => lstore.search = val}
          />
          <Popover
            visible={lstore.open}
            onVisibleChange={visible => {
              lstore.open = visible;
            }}
            onSelect={() => lstore.open = false}
            overlay={[
              <Popover.Item key="1"><span onClick={() => lstore.modal = true}>添加</span></Popover.Item>,
              <Popover.Item key="2"><span onClick={() => { store.userInfo.logout(); router.history.push({ pathname: '/auth/login' }); }}>退出</span></Popover.Item>,
            ]}
          >
            <MIcon style={{ margin: '0 10px' }} type="FaUserSecret" />
          </Popover>
        </div>
        <Modal
          visible={lstore.modal}
          transparent
          maskClosable={true}
          title={lstore.id ? '修改账号' : '添加账号'}
          footer={[{
            text: '取消', onPress: async () => {
              if (lstore.loading) {
                return;
              }
              lstore.id = '';
              lstore.name = '';
              lstore.account = '';
              lstore.password = '';
              lstore.mark = '';
              lstore.modal = false;
            },
            style: {
              color: lstore.loading ? '#bcbcbc' : ''
            }
          }, {
            text: lstore.id ? '修改' : '创建', onPress: async () => {
              if (lstore.loading) {
                lstore.loading = false;
              }
              lstore.loading = true;
              let res = null;
              if (lstore.id) {
                res = await services.updateCode({
                  id: lstore.id,
                  name: lstore.name,
                  account: lstore.account,
                  password: lstore.password,
                  mark: lstore.mark,
                });
              } else {
                res = await services.createCode({
                  name: lstore.name,
                  account: lstore.account,
                  password: lstore.password,
                  mark: lstore.mark,
                });
              }
              lstore.loading = false;
              lstore.id = '';
              lstore.name = '';
              lstore.account = '';
              lstore.password = '';
              lstore.mark = '';
              if (res.code === 0) {
                loader.refresh();
              } else {
                Toast.info('添加失败');
              }
              lstore.modal = false;
            },
            style: {
              color: lstore.loading ? '#bcbcbc' : ''
            }
          }]}
        >
          <InputItem disabled={lstore.loading} type="text" placeholder="名称" onChange={(value) => { lstore.name = value; }} value={lstore.name}>名称</InputItem>
          <InputItem disabled={lstore.loading} type="text" placeholder="账号" onChange={(value) => { lstore.account = value; }} value={lstore.account}>账号</InputItem>
          <InputItem style={{ display: lstore.id ? 'none' : 'block' }} disabled={lstore.loading} type="text" placeholder="密码" onChange={(value) => { lstore.password = value; }} value={lstore.password}>密码</InputItem>
          <InputItem disabled={lstore.loading} type="text" placeholder="备注" onChange={(value) => { lstore.mark = value; }} value={lstore.mark}>备注</InputItem>
        </Modal>
        <ActivityIndicator toast text='...' animating={lstore.loading} />
        <LoadListView
          loader={loader}
          className={className}
          renderItem={(item, sectionId, index) => <RenderItem
            item={item}
            sectionId={sectionId}
            router={router}
            search={lstore.search.toLowerCase()}
            toggleLoading={() => lstore.loading = !lstore.loading}
            edit={(it) => {
              lstore.id = it.id;
              lstore.name = it.name;
              lstore.account = it.account;
              lstore.password = it.password;
              lstore.mark = it.mark;
              lstore.modal = true;
            }}
            remove={async () => {
              lstore.loading = true;
              const res = await services.destroyCode(item);
              lstore.loading = false;
              if (res.code === 0) {
                loader.remove(index);
              } else {
                Toast.info('删除失败');
              }
            }}
          />}
        />
      </div>;
    }}
  </Observer>;
}
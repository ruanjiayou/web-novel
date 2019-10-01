import App from './app';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import 'antd-mobile/dist/antd-mobile.css';
import './components/common.css';
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/src/serviceWorker.js
import * as serviceWorker from './service-worker';
import { ActivityIndicator } from 'antd-mobile';
import { isDeskTop } from './utils/utils';
import globalStore from './global-state';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            info: null,
            isLoading: false,
            lastTS: Date.now(),
            isDesktop: isDeskTop()
        };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    componentDidMount() {
        document.getElementById('start-loading').style.display = 'none';
        document.addEventListener('visibilitychange', async (e) => {
            // TODO: 时间过长处理.刷新
            if (document.hidden) {
                globalStore.app.resetLeaveTS();
            } else if (globalStore.app.config.isLockerLocked === false) {
                globalStore.app.setLocked(Date.now() - globalStore.app.leaveTS > globalStore.app.config.lockerSeconds);
            }
        });
    }

    render() {
        if (this.state.hasError) {
            return <Fragment>
                <div>程序崩溃了,<div onClick={() => {
                    this.setState({ isLoading: true }, async () => {
                        // TODO: 防封处理 const result = await checkHost();
                        this.setState({ isLoading: false });
                        this.setState({ hasError: false }, () => {
                            window.location.reload();
                        });
                    });
                }}>点我重试</div></div>
                <ActivityIndicator
                    toast
                    text="正在刷新..."
                    animating={this.state.isLoading}
                />
            </Fragment>;
        } else if (this.state.isDesktop) {
            return <Fragment>
                {this.props.children}
                <ActivityIndicator
                    toast
                    text="正在刷新..."
                    animating={this.state.isLoading}
                />
            </Fragment>;
        } else {
            return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>程序正在开发中...</div>;
        }
    }
}

// 总入口: 将组件挂载到dom上
ReactDOM.render(<ErrorBoundary>
    <App />
</ErrorBoundary>, document.getElementById('root'));

// serviceWorker.unregister();
serviceWorker.register();
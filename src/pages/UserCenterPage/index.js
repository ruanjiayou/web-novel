import React, { Fragment, useEffect } from 'react';
import { Observer } from 'mobx-react-lite';
import { ActivityIndicator } from 'antd-mobile';
import globalStore from 'global-state';
import MIconView from 'components/MIconView';

export default function () {
    const userLoader = globalStore.userLoader;
    useEffect(() => {
        if (userLoader.isEmpty) {
            userLoader.refresh();
        }
    });
    return <Observer>{
        () => {
            return <Fragment>
                <ActivityIndicator animating={userLoader.isLoading} />
                <div className="full-width" style={{ padding: '0 20px' }}>
                    <div className="full-width-fix">
                        {/* TODO: 测试 */}
                        {/* <img src={userLoader.isEmpty ? '' : userLoader.item.avater} /> */}
                        <img src="/logo.jpg" style={{ margin: 20, borderRadius: '50%' }} alt=""/>
                    </div>
                    <div className="full-width-auto">{userLoader.isEmpty ? '---' : userLoader.item.name}</div>
                    <div className="full-width-fix"><MIconView type="FaAngleRight" /></div>
                </div>
                <div className="dd-common-alignside" style={{ padding: '10px 40px' }}>
                    <div>
                        <MIconView type="FaStar" />收藏
                    </div>
                    <div>
                        <MIconView type="FaHistory" />历史
                    </div>
                    <div>
                        <MIconView type="FaEllipsisV" />其他
                    </div>
                </div>
                <div className="dd-common-alignside" style={{ margin: '10px 40px' }}>
                    <div>
                        <MIconView type="FaStar" />收藏
                    </div>
                    <div>
                        <MIconView type="FaHistory" />历史
                    </div>
                    <div>
                        <MIconView type="FaEllipsisV" />其他
                    </div>
                </div>
            </Fragment>;
        }
    }</Observer>;
}
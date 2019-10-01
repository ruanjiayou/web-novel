import { createItemLoader } from './baseLoader';
import UserInfo from '../models/userInfo';
import services from '../services/index';

export default createItemLoader(UserInfo, async (params) => {
    return services.getUserInfo(params);
});
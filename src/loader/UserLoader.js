import services from '../services/index';
import UserModel from '../models/UserModel';
import { createItemLoader } from './BaseLoader';

export default createItemLoader(UserModel, async (params) => {
    return services.getUserInfo(params);
});
import { createItemsLoader } from './baseLoader';
import Code from '../models/code';
import services from '../services/index';

export default createItemsLoader(Code, async (params) => {
    return services.getCodes(params);
});
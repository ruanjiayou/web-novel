import services from 'services';
import ResourceModel from 'models/ResourceModel';
import { createItemLoader } from 'page-group-loader-model/BaseLoaderModel';

export default createItemLoader(ResourceModel, async (params) => {
  return services.getResource(params);
});

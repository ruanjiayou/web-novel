import services from 'services/index';
import Resource from 'models/ResourceModel';
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel';

export default createItemsLoader(Resource, async (params) => {
  return services.getActorVideos(params);
});

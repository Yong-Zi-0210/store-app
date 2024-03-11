const SYSTEM_NAME = "tutu-store";

/** 缓存数据时用到的 Key */
class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`;
  static readonly CAR_DETAIL = `${SYSTEM_NAME}-car-detail-key`;
  static readonly GOODS_DETAIL = `${SYSTEM_NAME}-product-detail-key`;
  static readonly HOTEL_DETAIL = `${SYSTEM_NAME}-hotel-detail-key`;
  static readonly JOB_DETAIL = `${SYSTEM_NAME}-job-detail-key`;
  static readonly COMPANY_DETAIL = `${SYSTEM_NAME}-company-detail-key`;
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`;
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`;
  static readonly USERINFO = `${SYSTEM_NAME}-userinfo`;
  static readonly RESUMEINFO = `${SYSTEM_NAME}-resumeinfo`;
  static readonly CITYNAME = `${SYSTEM_NAME}-city-name`;
}

export default CacheKey;

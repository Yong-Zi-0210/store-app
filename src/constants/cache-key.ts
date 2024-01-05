const SYSTEM_NAME = "tutu-store";

/** 缓存数据时用到的 Key */
class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`;
  static readonly CAR_DETAIL = `${SYSTEM_NAME}-car-detail-key`;
  static readonly PRODUCT_DETAIL = `${SYSTEM_NAME}-product-detail-key`;
  static readonly HOTEL_DETAIL = `${SYSTEM_NAME}-hotel-detail-key`;
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`;
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`;
  static readonly USERINFO = `${SYSTEM_NAME}-userinfo`;
}

export default CacheKey;

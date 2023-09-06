/**
 * Service.
 */
export class Service {
  /**
   * Constructor.
   *
   * @param services
   */
  constructor(services = undefined) {
    this._services = services ?? new Map();
  }

  /**
   * Get.
   *
   * @template T
   * @param {typeof T} serviceCtor
   * @return {T}
   */
  get(serviceCtor) {
    let service = this._services.get(serviceCtor);
    if (service) return service;
    service = new serviceCtor(this._services);
    this._services.set(serviceCtor, service);
    return service;
  }
}

/**
 * @author LuoHaoJun on 2023-06-26
 */
export default interface ICallback {

  onSuccess(obj: any);

  onError(e: Error);

}
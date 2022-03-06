import ResponsePrint from '../responses/response-print'
import ResponseDecorator from '../responses/response-decorator'

export default class CloudChiprCli {
  protected responsePrint: ResponsePrint
  protected responseDecorator: ResponseDecorator

  constructor () {
    this.responsePrint = new ResponsePrint()
    this.responseDecorator = new ResponseDecorator()
  }
}

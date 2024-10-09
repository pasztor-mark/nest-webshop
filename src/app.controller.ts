import { Body, Controller, Get, Param, Query, Render, Post, Res, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentDataDto } from 'PaymentDataDto.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    let errors: string[] = []
    return {
      termek: undefined,
      nev: undefined,
      irszam: undefined,
      varos: undefined,
      utca: undefined,
      hazszam: undefined,
      kupon: undefined
    }
  }
  @Post()
  @Render('index')
  createPayment(@Body() createPaymentDto: PaymentDataDto, @Res() res: Response) {
    let errors: string[] = []
    if (parseInt(createPaymentDto.cvc) < 99 || parseInt(createPaymentDto.cvc) > 1000) {
      errors.push("Érvénytelen CVC")
    }
    if (parseInt(createPaymentDto.irszam) < 999 || parseInt(createPaymentDto.cvc) > 10000) {
      errors.push("Érvénytelen irányítószám")
    }
    
    if (parseInt(createPaymentDto.hazszam) == 0) {
      errors.push("Érvénytelen házszám")
    }

    if (errors.length > 0) {
      console.log(errors)
      return {
        termek: createPaymentDto.termek,
        nev: createPaymentDto.nev,
        irszam: createPaymentDto.irszam,
        varos: createPaymentDto.varos,
        utca: createPaymentDto.utca,
        hazszam: createPaymentDto.hazszam,
        kupon: createPaymentDto.kupon,
      }
    }
    else {
      console.log(createPaymentDto)
      
    }
}
}

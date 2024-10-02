import { Body, Controller, Get, Param, Query, Render, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentDataDto } from 'PaymentDataDto.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Post()
  createPayment(@Body() createPaymentDto: PaymentDataDto, @Res() res: Response) {
    let errors = []
    if (parseInt(createPaymentDto.cvc) > 0 && parseInt(createPaymentDto.cvc) < 1000) {
      errors.push("Érvénytelen CVC")
    }
    if (parseInt(createPaymentDto.irszam) > 999 && parseInt(createPaymentDto.cvc) < 10000) {
      errors.push("Érvénytelen irányítószám")
    }
    
    if (parseInt(createPaymentDto.hazszam) == 0) {
      errors.push("Érvénytelen házszám")
    }

    if (errors) {
      throw new Error("hiba")
    }
    else {
      return createPaymentDto
    }
}
}

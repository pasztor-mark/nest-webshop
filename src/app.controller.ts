import { Body, Controller, Get, Param, Query, Render, Post } from '@nestjs/common';
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
  createPayment(@Body() createPaymentDto: PaymentDataDto) {
    console.log(createPaymentDto)
  }
}

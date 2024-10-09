import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Render,
  Post,
  Res,
  Redirect,
} from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';
import { PaymentDataDto } from 'PaymentDataDto.dto';
import { ConfirmPaymentDto } from 'ConfirmPaymentDto.dto';
import { error } from 'console';

function toCsv(payment: ConfirmPaymentDto) {
  const line = `${payment.nev};${payment.bankszamlaszam};${payment.tos}\n`;
  fs.appendFile('public/exports.csv', line, 'utf-8', (err) => {});
  
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  //Múlt órai
  @Get()
  @Render('index')
  getHello() {
    let errors: string[] = [];
    return {
      termek: undefined,
      nev: undefined,
      irszam: undefined,
      varos: undefined,
      utca: undefined,
      hazszam: undefined,
      kupon: undefined,
    };
  }
  @Post()
  @Render('index')
  createPayment(
    @Body() createPaymentDto: PaymentDataDto,
    @Res() res: Response,
  ) {
    let errors: string[] = [];
    if (
      parseInt(createPaymentDto.cvc) < 99 ||
      parseInt(createPaymentDto.cvc) > 1000
    ) {
      errors.push('Érvénytelen CVC');
    }
    if (
      parseInt(createPaymentDto.irszam) < 999 ||
      parseInt(createPaymentDto.cvc) > 10000
    ) {
      errors.push('Érvénytelen irányítószám');
    }

    if (parseInt(createPaymentDto.hazszam) == 0) {
      errors.push('Érvénytelen házszám');
    }

    if (errors.length > 0) {
      console.log(errors);
      return {
        termek: createPaymentDto.termek,
        nev: createPaymentDto.nev,
        irszam: createPaymentDto.irszam,
        varos: createPaymentDto.varos,
        utca: createPaymentDto.utca,
        hazszam: createPaymentDto.hazszam,
        kupon: createPaymentDto.kupon,
      };
    } else {
      console.log(createPaymentDto);
    }
  }
  //Aktuális
  @Get('/paymentProcess')
  @Render('Kifizetes')
  getPaymentProcess() {
    let messages = [];
    return { messages: messages, nev: undefined, szamlaszam: undefined };
  }
  @Post('/paymentProcess')
  @Render('Kifizetes')
  postPaymentProcess(@Body() confirmPayment: ConfirmPaymentDto) {
    let messages = [];
    if (!confirmPayment.nev.includes(' ') || confirmPayment.nev.length < 1) {
      messages.push('Hiba: Érvényes nevet adjon meg!');
    }
    if (/^\d+$/.test(confirmPayment.bankszamlaszam.replaceAll("-", '')) == false) {

      messages.push('Hiba: Betű a számlaszámban.');
    }
    if (
      confirmPayment.bankszamlaszam.length != 17 &&
      confirmPayment.bankszamlaszam.length != 26
    ) {
      if (confirmPayment.bankszamlaszam.length == 17) {
        if (confirmPayment.bankszamlaszam[8] != '-') {
          messages.push('Hiba: Érvéntelen bankszámlaszám karakterszám!');
        }
      } else if (confirmPayment.bankszamlaszam.length == 17) {
        if (confirmPayment.bankszamlaszam[17] != '-') {
        }
      } else messages.push('Hiba: Érvéntelen bankszámlaszám karakterszám!');
    }
    if (confirmPayment.tos != 'accepted') {
      messages.push(
        'A beküldéshez el kell fogadni a Felhasználói Feltételeket. ',
      );
    }
    if (messages.length == 0) {
      console.log('Sikeres megerősítés. CSV a public mappában található.');
      toCsv(confirmPayment)
    }
    return {
      messages: messages,
      nev: confirmPayment.nev,
      szamlaszam: confirmPayment.bankszamlaszam,
    };
  }
}

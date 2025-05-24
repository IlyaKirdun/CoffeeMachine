const originalLog = console.log;
const originalInfo = console.info;
const originalError = console.error;

console.log = (...args) => {
  originalLog('\x1b[32m[LOG]\x1b[0m', ...args);
};

console.info = (...args) => {
  originalInfo('\x1b[33m[INFO]\x1b[0m', ...args);
};

console.error = (...args) => {
  originalError('\x1b[31m[ERROR]\x1b[0m', ...args);
};

class CoffeeMachine {
  powerWork = 230;
  status = false;
  waterAmount = 0;
  coffeeTank = 0;
  maxTank = 10;
  maxWaterAmount = 1000;
  readyEspresso = 0;



  constructor(power) {
    this.power = power;
  }

  isInvalidAmount(value){
    return value <= 0 || typeof value !== 'number'
  }

  isOverflow(value, current, max){
    return (value + current) > max
  }

  canBrew(waterNeeded, coffeeNeeded){
    return this.status
        && this.waterAmount >= waterNeeded
        && this.coffeeTank >= coffeeNeeded
  }

  turnOn (){
    if(this.power < this.powerWork || this.power > this.powerWork) {
      console.error('Кофемашина не работает')
    }
    else {
      this.status = true;
      console.log('Кофемашина включена')
    }
  }

  turnOff(){
    if(!this.status) {
      console.error('Кофемашина не была включена')
    }
    else {
      this.status = false
      console.log('Кофемашина выключена')
    }
  }

  redTurnOff() {
    this.status = false;
    console.error('Кофемашина выключена');
  }


  addWater(water) {
    if(this.isInvalidAmount(water)) {
      console.error('Неверное количество воды')
    }
    else if(this.isOverflow(water, this.waterAmount, this.maxWaterAmount)) {
      console.error('Ёмкость с водой переполнена')
      this.redTurnOff()
    }
    else{
      this.waterAmount += water;
      console.log(`Налито ${water} мл. воды. Количество воды: ${this.waterAmount} мл.`);
    }
  }

  addCoffee(coffee){
    if(this.isInvalidAmount(coffee)) {
      console.error('Неверное количество кофе')
    }
    else if(this.isOverflow(coffee, this.coffeeTank, this.maxTank)) {
      console.error('Ёмкость с кофе переполнена')
      this.redTurnOff()
    }
    else{
      this.coffeeTank += coffee;
      console.log(`Насыпано ${coffee} гр. кофе. Количество кофе ${this.coffeeTank} гр.`);
    }
  }

  brewEspresso(){
    if(this.canBrew(100, 2)) {
      this.readyEspresso += 100;
      this.coffeeTank -= 2;
      this.waterAmount -= 100;
      console.log(`${this.readyEspresso} мл эспрессо сварено`)
    }
    else if(!this.status){
      console.error('Кофемашина не включена')
    }
    else {
      this.waterAmount < 100 ? console.error('Недостаточно воды') : console.error('Недостаточно кофе');
      this.redTurnOff()
    }
  }
}


// //Всё хорошо!!!
// const coffeeMachine = new CoffeeMachine(230);
// console.info('След. логи должны быть зеленые');
// coffeeMachine.turnOn();
// coffeeMachine.addWater(300);
// coffeeMachine.addCoffee(6);
// coffeeMachine.brewEspresso();
// coffeeMachine.turnOff();
// console.info('Валидный тест закончен',`\n`);


// //Неправильное питание
// const coffeeMachineBadPower = new CoffeeMachine(220);
// console.info('След. логи должны быть зеленые');
// coffeeMachineBadPower.addWater(300);
// coffeeMachineBadPower.addCoffee(6);
// console.info('След. логи должны быть красные');
// coffeeMachineBadPower.turnOn();
// coffeeMachineBadPower.turnOff();
// coffeeMachineBadPower.brewEspresso();
// console.info('Тест питания закончен',`\n`);


// //Все тесты на проверку воды
// const coffeeMachineCheckWater = new CoffeeMachine(230);
// console.info('След. лог красный на большое кол-во воды');
// coffeeMachineCheckWater.addWater(1001);
// console.info('След. лог зелёный на заполнение');
// coffeeMachineCheckWater.addWater(500);
// console.info('След. лог красный на проверку постепенного переполнения');
// coffeeMachineCheckWater.addWater(501);
// console.info('След. лог красный на некорректный ввод');
// coffeeMachineCheckWater.addWater('a');
// console.info('Тест воды закончен',`\n`);

class CappuccinoMachine extends CoffeeMachine {
  foamAmount = 0;
  maxFoamAmount = 1000;
  milkAmount = 0;
  maxMilkAmount = 1000;
  readyCappuccino = 0;

  constructor(power) {
    super(power);
  }

  addMilk(milk) {
    if (this.isInvalidAmount(milk)) {
      console.error('Неверное количество молока');
    } else if (this.isOverflow(milk, this.milkAmount, this.maxMilkAmount)) {
      console.error('Ёмкость с молоком переполнена')
      this.redTurnOff()
    } else {
      this.milkAmount += milk;
      console.log(`Налито ${milk} мл. молока. Количество молока: ${this.milkAmount} мл.`)
    }
  }

  whipMilk() {
    if(this.isOverflow(100, this.foamAmount, this.maxFoamAmount)){
      console.error('Ёмкость с пеной переполнена');
      this.redTurnOff();
    }
    if (this.status && this.milkAmount >= 100) {
      this.foamAmount += 100;
      this.milkAmount -= 100;
      console.log(`100 мл. пенки приготовлено. Количество пены: ${this.foamAmount} мл.`);
    }
    else {
      console.error('Недостаточно молока');
      this.redTurnOff();
    }
  }

  brewCappuccino() {
    if (!this.status){
      console.error('Кофемашина не включена')
    }
    if (this.status && this.readyEspresso < 100) {
      console.info('Нет эспрессо, варю эспрессо')
      this.brewEspresso();
    }
    if (this.status && this.foamAmount < 100){
      console.info('Нет пены, готовлю пену')
      this.whipMilk()
    }
    if (this.status && this.foamAmount >= 100 && this.readyEspresso >= 100) {
      this.readyCappuccino += this.readyEspresso + this.foamAmount;
      this.readyEspresso -= 100;
      this.foamAmount -= 100;
      console.log(`${this.readyCappuccino} мл. капучино готово`);
    }
  }
}


console.info('Валидный тест')
const cappuccinoMachine = new CappuccinoMachine(230);
console.info('След. логи должны быть зеленые');
cappuccinoMachine.turnOn();
cappuccinoMachine.addWater(1000);
cappuccinoMachine.addCoffee(11);
cappuccinoMachine.addMilk(1000);
cappuccinoMachine.brewCappuccino();
cappuccinoMachine.turnOff();
console.info('Валидный тест закончен',`\n`);
//
// console.info('Неправильное питание')
// const cappuccinoMachineBadPower = new CappuccinoMachine(220);
// console.info('След. логи должны быть зеленые');
// cappuccinoMachineBadPower.addWater(300);
// cappuccinoMachineBadPower.addCoffee(6);
// cappuccinoMachineBadPower.addMilk(300);
// console.info('След. логи должны быть красные');
// cappuccinoMachineBadPower.turnOn();
// cappuccinoMachineBadPower.turnOff();
// cappuccinoMachineBadPower.brewCappuccino();
// console.info('Тест питания закончен',`\n`);
//
// console.info('Все тесты на проверку заполнения воды')
// const cappuccinoMachineCheckWater = new CappuccinoMachine(230);
// console.info('След. лог красный на большое кол-во воды');
// cappuccinoMachineCheckWater.addWater(1001);
// console.info('След. лог зелёный на заполнение');
// cappuccinoMachineCheckWater.addWater(500);
// console.info('След. лог красный на проверку постепенного переполнения');
// cappuccinoMachineCheckWater.addWater(501);
// console.info('След. лог красный на некорректный ввод');
// cappuccinoMachineCheckWater.addWater('a');
// console.info('Тест воды закончен',`\n`);
//
// console.info('Все тесты на проверку заполнения кофе')
// const cappuccinoMachineCheckCoffee = new CappuccinoMachine(230);
// console.info('След. лог красный на большое кол-во кофе');
// cappuccinoMachineCheckCoffee.addCoffee(11);
// console.info('След. лог зелёный на заполнение');
// cappuccinoMachineCheckCoffee.addCoffee(5);
// console.info('След. лог красный на проверку постепенного переполнения');
// cappuccinoMachineCheckCoffee.addCoffee(6);
// console.info('След. лог красный на некорректный ввод');
// cappuccinoMachineCheckCoffee.addCoffee('a');
// console.info('Тест кофе закончен',`\n`);
//
// console.info('Все тесты на проверку заполнения молока');
// const cappuccinoMachineCheckMilk = new CappuccinoMachine(230);
// console.info('След. лог красный на большое кол-во молока');
// cappuccinoMachineCheckMilk.addMilk(1001);
// console.info('След. лог зелёный на заполнение');
// cappuccinoMachineCheckMilk.addMilk(500);
// console.info('След. лог красный на проверку постепенного переполнения');
// cappuccinoMachineCheckMilk.addMilk(501);
// console.info('След. лог красный на некорректный ввод');
// cappuccinoMachineCheckMilk.addMilk('a');
// console.info('Тест молока закончен',`\n`);
//
// console.info('Приготовление кофе без питания')
// const brewCappuccinoNoPower = new CappuccinoMachine();
// console.info('След. лог зеленый на добавление кофе, молока и воды');
// brewCappuccinoNoPower.addWater(100);
// brewCappuccinoNoPower.addCoffee(2);
// brewCappuccinoNoPower.addMilk(100);
// console.info('След. лог красный на приготовление');
// brewCappuccinoNoPower.brewCappuccino();
// console.info('Тест на варку без воды закончен',`\n`);
//
// console.info('Приготовление кофе без воды')
// const brewCappuccinoNoWater = new CappuccinoMachine();
// console.info('След. логи зеленые на добавление кофе, молока и включение питания');
// brewCappuccinoNoWater.turnOn();
// brewCappuccinoNoWater.addCoffee(2);
// brewCappuccinoNoWater.addMilk(100);
// console.info('След. лог красный на приготовление');
// brewCappuccinoNoWater.brewCappuccino();
// console.info('Тест на варку без воды закончен',`\n`);
//
// console.info('Приготовление кофе без кофе')
// const brewCappuccinoNoCoffee = new CappuccinoMachine();
// console.info('След. логи зеленые на добавление воды, молока и включение питания');
// brewCappuccinoNoCoffee.turnOn();
// brewCappuccinoNoCoffee.addWater(100);
// brewCappuccinoNoCoffee.addMilk(100);
// console.info('След. лог красный на приготовление');
// brewCappuccinoNoCoffee.brewCappuccino();
// console.info('Тест на варку без кофе закончен',`\n`);
//
// console.info('Приготовление кофе без пены')
// const brewCappuccinoNoFoam = new CappuccinoMachine();
// console.info('След. логи зеленые на добавление воды, кофе, включение питания и варку эспрессо');
// brewCappuccinoNoFoam.turnOn();
// brewCappuccinoNoFoam.addWater(100);
// brewCappuccinoNoFoam.addCoffee(2);
// brewCappuccinoNoFoam.brewEspresso();
// console.info('След. логи красные на приготовление пены');
// brewCappuccinoNoFoam.whipMilk();
// console.info('Тест на варку без пены закончен',`\n`);
//
// console.info('Приготовление кофе без молока')
// const brewCappuccinoNoMilk = new CappuccinoMachine();
// console.info('След. логи зеленые на добавление воды, кофе, включение питания и варку эспрессо');
// brewCappuccinoNoMilk.turnOn();
// brewCappuccinoNoMilk.addWater(100);
// brewCappuccinoNoMilk.addCoffee(2);
// brewCappuccinoNoMilk.brewEspresso();
// console.info('След. логи желтый и красные на приготовление');
// brewCappuccinoNoMilk.brewCappuccino()
// console.info('Тест на варку без молока закончен',`\n`);
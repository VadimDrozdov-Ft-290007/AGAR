var laser, lasers;
var ground_1, ground_2, grounds;
var rockets, rocket;
var robot;
var speed, time = 0;
var stats;
var cursors;
var lastFired = 0;
var isDown = false;
var mouseX = 0;
var mouseY = 0;
var stars, star_1, star_2, star_3, star_4;
var hearts, heart_1, heart_2, heart_3;
var coin = 0, coins = 0, coinText;
var hpText, hp = 3;
var bombs;
var whatgame = '';

class Boot extends Phaser.Scene {
    constructor (){super('boot');}

    //предзагрузка всех картинок
    preload () 
    {
        this.load.image('background','assets/background.gif');
        this.load.image('menu_cat', 'assets/menu_cat.png');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('robot', 'assets/robot.png');
        this.load.image('laser', 'assets/laser.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.image('background_game2','assets/background_game2.png');
        this.load.image('ground_game2','assets/ground_2.png');
        this.load.image('rocket','assets/rocket.png');
        this.load.image('heart','assets/heart.png');

    }

    //запуск сцены с выбором игры
    create () 
    {
        this.scene.start('hub');
    }
    
}

class Hub extends Phaser.Scene {
    constructor (){super('hub');}

    create ()
    {   
        //добавление фонов игры как кнопок выбора
        var button1 = this.add.image(0, 300, 'sky', 0).setInteractive();
        var button2 = this.add.image(800, 300, 'background_game2', 0).setInteractive();

        //текстовое содержание сцены
        this.add.text(255, 40, 'AGAR', { fontFamily: 'bebas', fontSize: 100, color: '#ff00ff' }).setShadow(2, 2, "#333333", 2, false, true);
        this.add.text(245, 140, 'arcade game about robots', { fontFamily: 'bebas', fontSize: 30, color: '#ff00ff' }).setShadow(2, 2, "#333333", 2, false, true);
	    this.add.text(100, 520, 'Кликай мышкой, чтобы начать играть!', { fontFamily: 'bebas', fontSize: 40, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
        this.add.text(15, 300, 'Уровень 1: Летающий робот', { fontFamily: 'bebas', fontSize: 30, color: '#00ffff' })
        this.add.text(415, 300, 'Уровень 2: Бегающий робот', { fontFamily: 'bebas', fontSize: 30, color: '#ffff00' })
        
        //запуск функции старкт при нажатии мышкой на картинку
        button1.on('pointerup', function () {this.start('game'); }, this);
        button2.on('pointerup', function () {this.start('game_2'); }, this);
        
        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);
    }
    

    //запуск инструкции, запоминание выбраной игры
    start (game)
    {   
        whatgame = game
        // затухание камеры через 125мс
        this.time.delayedCall(125, function() {
            this.cameras.main.fade(125);
        }, [], this);

        // запускаем сцену с инструкцией через 250мс
        this.time.delayedCall(250, function() {
            this.scene.start('instructions');
        }, [], this);
    }
}

class Instructions extends Phaser.Scene {
    constructor (){super('instructions');}

    create ()
    {   
        this.add.image(400, 300, 'background');
        this.add.image(400, 270, 'menu_cat')
        this.add.text(20, 40, 'Инструкция:', { fontFamily: 'bebas', fontSize: 50, color: '#ff00ff' }).setShadow(2, 2, "#333333", 2, false, true);
	    this.add.text(20, 520, 'Кликай мышкой, чтобы начать играть!', { fontFamily: 'bebas', fontSize: 40, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
        this.input.once('pointerdown', this.start, this);
        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);

        if (whatgame == 'game'){
            this.add.text(20, 120, 'Ты должен управлять роботом и расстреливать звёздочки!', { fontFamily: 'bebas', fontSize: 20, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
        }else if (whatgame == 'game_2'){
	        this.add.text(20, 120, 'Ты должен управлять роботом и дойти до конца уровня, уворачиваясь от ракет!', { fontFamily: 'bebas', fontSize: 20, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
        }

    }

    //запуск запомненой игры по нажатию клавиши мыши
    start ()
    {   
        // затухание камеры через 125мс
        this.time.delayedCall(125, function() {
            this.cameras.main.fade(125);
        }, [], this);

        // запускаем сцену с инструкцией через 250мс
        this.time.delayedCall(250, function() {
            this.scene.start(whatgame);
        }, [], this);
    }
}

class Game_Lvl_1 extends Phaser.Scene {
    constructor (){super('game');}

    create ()
    {   
        //задний фон
        this.add.image(400, 300, 'sky');

        //создание класса снарядов лазера, свойства и события
        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize: function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laser');
                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;
                this.speed = Phaser.Math.GetSpeed(600, 1);
            },

            fire: function (mx, my, rx, ry)
            {
                this.setActive(true);
                this.setVisible(true);
                this.setPosition(rx, ry);
                var angle = Phaser.Math.Angle.Between(mx, my,  rx, ry);
                this.setRotation(angle);
                this.incX = Math.cos(angle);
                this.incY = Math.sin(angle);
                this.lifespan = 500;
            },

            update: function (time, delta)
            {
                this.lifespan -= delta;
                this.x -= this.incX * (this.speed * delta);
                this.y -= this.incY * (this.speed * delta);

                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        });

        //создание физической группы - звезды
        stars = this.physics.add.group();

        //генерация звезд
        for (let i = 0; i < 5; i++) {stars.create(Phaser.Math.Between(40,760),Phaser.Math.Between(40,560),"star")}
        
        //создание физической группы - лазеры
        lasers = this.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });
        
        //отслеживание перекрытия лазерами звёзд, вызов функции при перекрытии
        this.physics.add.overlap(lasers, stars, this.collectStar, null, this);

        //создание физического робота, с глубиной 1 
        robot = this.physics.add.sprite(400, 300, 'robot').setDepth(1);

        //столкновение робота с обьектами
        robot.setBounce(1);

        //столкновение робота с границами
        robot.setCollideWorldBounds(true); 

        //создание физической группы - бомбы
        bombs = this.physics.add.group();

        //отслеживание столкновения робота с бомбами, вызов функции при столкновении
        this.physics.add.collider(robot, bombs, this.hitBomb, null, this);
        
        //отслеживание физикой столкновений бомб с бомбами 
        this.physics.add.collider(bombs, bombs);

        //отслеживание нажатий клавишь мыши
        this.input.on('pointerdown', function (pointer) {
            isDown = true;
            mouseX = pointer.x;
            mouseY = pointer.y;
        });
        this.input.on('pointerup', function (pointer) {isDown = false;});

        //отслеживание курсора мыши
        this.input.on('pointermove', function (pointer) {
            mouseX = pointer.x;
            mouseY = pointer.y;
        });

        //отслеживание нажатий стелочек на клавиатуре
        cursors = this.input.keyboard.createCursorKeys();

        //скорость ?
        speed = Phaser.Math.GetSpeed(300, 1);

        //создание текстового поля, выводит счёт
        coinText = this.add.text(16, 16, 'coin: 0', { fontSize: '32px', fill: '#000' });

        //создание текстового поля, выводит жизни
        hpText = this.add.text(16, 560, 'HP: 3', { fontSize: '32px', fill: '#000' });

        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);
    }

    //функция вызывающаяся при пререкрытии лазерами звезд
    collectStar (lasers, stars){
        //перенос звезы в рандомное место
        stars.setPosition(Phaser.Math.Between(40,760),Phaser.Math.Between(40,560))
        
        coin += 10;

        //вывод счета в текстовое поле
        coinText.setText('coin: ' + coin)

        //переход к следующему уровню
        if (coin == 500) {
            //this.physics.pause();
            //this.end()
        }

        //генерация бомбы при наборе +50 очков
        if (coin % 50 == 0){
            //генерация бомбы
            var bomb = bombs.create(Phaser.Math.Between(40,760),Phaser.Math.Between(40,560), 'bomb');
            //установка бомбе свойства отскока от препядствий без потери скорости
            bomb.setBounce(1);
            //установка бомбе свойства отскока от границ
            bomb.setCollideWorldBounds(true);
            //устанавливаем вектор движения бомбы
            bomb.setVelocity(Phaser.Math.Between(-70, 70), Phaser.Math.Between(-70, 70));
        }
    }

    //функция, вызывающаяся при столкновении бомбы с роботом
    hitBomb (robot, bomb){
        //тряска камеры
        this.cameras.main.shake(500)
        
        //вывод хп в текстовое поле
        hp -= 1;
        hpText.setText('HP: ' + hp)

        //конец игры при 3х столкновений с бомбами
        if (hp == 0){ 
            hp = 3;
            coins = coin;
            coin = 0;
            //остановка игры 
            this.physics.pause();

            // затухание камеры через 250мс
            this.time.delayedCall(250, function() {
                this.cameras.main.fade(250);
            }, [], this);

            // запускаем сцену конца игры через 500мс
            this.time.delayedCall(500, function() {
                this.scene.start('gameOver');
            }, [], this);

        } else if (hp == 1){
            //окраска робота в красный после 2х попаданий
            robot.setTint(0xff0000);
        } else if (hp == 2){
            //окраска робота в желтый после 1 попадания
            robot.setTint(0xffff00);
        }

        //удаление бомбы при столкновении
        bomb.setActive(false);
        bomb.setVisible(false);
        bomb.disableBody(true, true);
    }

    //основная функция событий сцены игры
    update (time, delta)
    {  
        //движение робота по оси х при нажатии на стрелки
        if (cursors.left.isDown){
            robot.setVelocityX(-100);
        } else if (cursors.right.isDown){
            robot.setVelocityX(100);
        } else {
            robot.setVelocityX(0);
        }
        
        //движение робота по оси у при нажатии на стрелки
        if (cursors.up.isDown){
            robot.setVelocityY(-100);
        } else if (cursors.down.isDown){
            robot.setVelocityY(100);
        } else {
            robot.setVelocityY(0);
        }

        //стрельба
        if (isDown && time > lastFired)
        {
            var laser = lasers.get();
            if (laser)
            {
                laser.fire(mouseX, mouseY, robot.x, robot.y);
                lastFired = time + 50;
            }
        }
        //отслеживание роботом курсора мыши
        robot.setRotation(Phaser.Math.Angle.Between(mouseX, mouseY, robot.x, robot.y) - Math.PI / 2);
    }
}

// Сцена с летящим роботом
class Game_Lvl_2 extends Phaser.Scene {
    constructor (){super('game_2');}

    create ()
    {
        this.add.image(400, 200, 'background_game2');

        hearts = this.physics.add.staticGroup(); 
        heart_1 = hearts.create(700, 30, 'heart');
        heart_2 = hearts.create(720, 30, 'heart');
        heart_3 = hearts.create(740, 30, 'heart');

        //создание физического робота
        robot = this.physics.add.sprite(40, 450, 'robot');

        //столкновение робота с обьектами
        robot.setBounce(0.2);

        //столкновение робота с границами
        robot.setCollideWorldBounds(true); 

        //создание земли
        grounds = this.physics.add.staticGroup();
        ground_1 = grounds.create (400, 535, 'ground_game2'); 
        ground_2 = grounds.create (1200, 535, 'ground_game2');

        //гравитация для робота
        robot.body.setGravityY(300)

        //робот стоит на земле
        this.physics.add.collider(robot, grounds)

        //отслеживание нажатий стелочек на клавиатуре
        cursors = this.input.keyboard.createCursorKeys();

        // создание ракет
        rockets = this.physics.add.group();
        rocket = rockets.create(800, Phaser.Math.Between(200,460), 'rocket').setOrigin(0, 0);
        rocket.setVelocityX(-100);

        //отслеживание столкновения робота с ракетами, вызов функции при столкновении
        this.physics.add.collider(robot, rockets, this.hitRocket, null, this);

        //создание текстового поля, выводит счёт
        coinText = this.add.text(16, 20, 'Coins: 0', { fontSize: '32px', fill: '#000' });

        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);

        //создание физической группы - звезды
        stars = this.physics.add.group();

        //генерация звезд
        star_1 = stars.create(Phaser.Math.Between(40, 250), 450, 'star');
        star_2 = stars.create(Phaser.Math.Between(250, 450), 450, 'star');
        star_3 = stars.create(Phaser.Math.Between(450, 650), 450, 'star');
        star_4 = stars.create(Phaser.Math.Between(650, 800), 450, 'star');

        //отслеживание перекрытия роботом звёзд, вызов функции при перекрытии
        this.physics.add.overlap(robot, stars, this.collectStar, null, this);
    }

    //функция, вызывающаяся при столкновении ракеты с роботом
    hitRocket (robot, rocket){
        hp -= 1;

        //тряска камеры
        this.cameras.main.shake(500)

        //конец игры при 3х столкновений с ракетами
        if (hp == 0){ 
            hp = 3;
            coins = coin;
            coin = 0;

            //минус одно сердечко
            heart_1.setActive(false);
            heart_1.setVisible(false);
            heart_1.disableBody(true, true);

            //остановка игры 
            this.physics.pause();

            // затухание камеры через 250мс
            this.time.delayedCall(250, function() {
                this.cameras.main.fade(250);
            }, [], this);

            // запускаем сцену конца игры через 500мс
            this.time.delayedCall(500, function() {
                this.scene.start('gameOver');
            }, [], this);

        } else if (hp == 1){
            //окраска робота в красный
            robot.setTint(0xff0000);
            //минус одно сердечко
            heart_2.setActive(false);
            heart_2.setVisible(false);
            heart_2.disableBody(true, true);

        } else if (hp == 2){
            //окраска робота в желтый
            robot.setTint(0xffff00);
            //минус одно сердечко
            heart_3.setActive(false);
            heart_3.setVisible(false);
            heart_3.disableBody(true, true);
        }

        //удаление ракеты при столкновении
        rocket.setActive(false);
        rocket.setVisible(false);
        rocket.disableBody(true, true);

        rocket = rockets.create(800, Phaser.Math.Between(200,460), 'rocket').setOrigin(0, 0);
        rocket.setVelocityX(-100);
    }

    //функция вызывающаяся при пререкрытии лазерами звезд
    collectStar (robot, stars){
        //перенос звезы в рандомное место
        stars.setPosition(Phaser.Math.Between(810,1000), 450);

        coin += 10;

        //вывод счета в текстовое поле
        coinText.setText('Coins: ' + coin)

        //переход к следующему уровню
        if (coin == 500) {
            //this.physics.pause();
            //this.end()
        }
    }

    update ()
    {
        time++

        //движение робота по оси х при нажатии на стрелки
        if (cursors.left.isDown){
            robot.setVelocityX(-150);
        } else if (cursors.right.isDown && robot.x <= 550){
            robot.setVelocityX(150);
        } else {
            robot.setVelocityX(0);
        }
        
        //прыжок
        if (cursors.up.isDown && robot.body.touching.down)
        {
            robot.setVelocityY(-300);
        }

        //генерация летящих ракет
        if (robot.x > 300 && time % 400 == 0) {
            for (var i = 0; i < Phaser.Math.Between(1,3); i++) {
                rocket = rockets.create(Phaser.Math.Between(800,900), Phaser.Math.Between(200,430), 'rocket').setOrigin(0, 0);
                rocket.setVelocityX(Phaser.Math.Between(-50,-200));
            }
        }

        //движение земли и звёзд
        if (robot.x > 540 && cursors.right.isDown) {
            ground_1.x = ground_1.x - 2;
            ground_2.x = ground_2.x - 2;
        
            if (ground_1.x == -400){
                ground_1.x = 1200;
            }
            if (ground_2.x == -400){
                ground_2.x = 1200;
            }

            star_1.x = star_1.x - 2;
            star_2.x = star_2.x - 2;
            star_3.x = star_3.x - 2;
            star_4.x = star_4.x - 2;

            if (star_1.x < -10){
                star_1.x = Phaser.Math.Between(810, 1000);
            }
            if (star_2.x < -10){
                star_2.x = Phaser.Math.Between(810, 1000);
            }
            if (star_3.x < -10){
                star_3.x = Phaser.Math.Between(810, 1000);
            }
            if (star_4.x < -10){
                star_4.x = Phaser.Math.Between(810, 1000);
            }
        }
    }
}

class GameOver extends Phaser.Scene {
    constructor (){super('gameOver');}

    create ()
    {
        this.add.image(400, 300, 'background');

        this.add.text(400, 120, 'Ты проиграл!', { fontFamily: 'bebas', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setOrigin(0.5);
        this.add.text(400, 250, 'Счёт: '+coins, { fontFamily: 'bebas', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setOrigin(0.5);
        this.add.text(400, 520, 'жми пробел, чтобы вернуться на начальный экран!', { fontFamily: 'bebas', fontSize: 26, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setOrigin(0.5);
        
        this.input.keyboard.addKey('space').on('down', this.restart, this);
        
        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);
    }

    restart ()
    {
        this.scene.start('hub');
    }
}


var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    pixelArt: true,
    physics: {
        default: 'arcade', arcade: {debug: false}
    },
    scene: [Boot, Hub, Instructions, Game_Lvl_1, Game_Lvl_2, GameOver]
};

var game = new Phaser.Game(config);
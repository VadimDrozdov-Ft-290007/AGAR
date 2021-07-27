var laser, lasers;
var ysk = 0;
var ground_1, ground_2, grounds;
var rockets, rocket, rocket_1, rocket_2, rocket_3, rocket_4;
var robot;
var reticle;
var barriers, barrier_1, barrier_2, setbarrier = 0;
var speed, time = 0, timeR = 0;
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
var lifespanNull = 500;

class Boot extends Phaser.Scene {
    constructor (){super('boot');}

    //предзагрузка всех картинок
    preload ()
    {
        this.load.image('blue', 'assets/blue.png');
        this.load.image('line', 'assets/line.png');
        this.load.image('qadlin', 'assets/qadlin.png');
        this.load.image('agar', 'assets/agar.png');
        this.load.image('but_menu', 'assets/but_menu.png');

        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('robot', 'assets/robot.png');
        this.load.image('target', 'assets/target.png');
        this.load.image('laser', 'assets/laser.png');
        this.load.image('bomb', 'assets/bomb.png');

        this.load.spritesheet('robotsprite', 'assets/robosprite.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('jet', 'assets/jet.png');
        this.load.image('background_game2','assets/background_game2.png');
        this.load.image('ground_game2','assets/ground_2.png');
        this.load.image('rocket','assets/rocket.png');
        this.load.image('heart','assets/heart.png');
        this.load.image('barrier_1','assets/barrier_1.png');
        this.load.image('barrier_2','assets/barrier_2.png');
        this.load.image('barrier_3','assets/barrier_3.png');
        this.load.image('barrier_4','assets/barrier_4.png');

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
        //фон
        this.add.image(500, 300, 'blue');

        //логотип
        this.add.image(500, 100, 'agar');

        //добавление фонов игры как кнопок выбора
        var button1 = this.add.image(300, 400, 'sky', 0).setInteractive().setDisplaySize(200,150);
        this.add.image(300, 400, 'qadlin');
        var button2 = this.add.image(700, 400, 'background_game2', 0).setInteractive().setDisplaySize(200,150);
        this.add.image(700, 400, 'qadlin');

        //текстовое содержание сцены
	    this.add.text(130, 520, 'Кликай мышкой на картинку, чтобы начать играть!', { fontFamily: 'bebas', fontSize: 35, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
        this.add.text(190, 270, 'Летающий робот', { fontFamily: 'bebas', fontSize: 30, color: '#000000' })
        this.add.text(590, 270, 'Бегающий робот', { fontFamily: 'bebas', fontSize: 30, color: '#000000' })

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
        //фон
        this.add.image(500, 300, 'blue');

        //логотип
        this.add.image(500, 100, 'agar');

        //текстовое содержание
        this.add.text(100, 310, 'Инструкция:', { fontFamily: 'bebas', fontSize: 50, color: '#ff00ff' }).setShadow(2, 2, "#333333", 2, false, true);

        this.add.text(100, 520, 'Жми пробел, чтобы начать играть!', { fontFamily: 'bebas', fontSize: 40, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
        if (whatgame == 'game'){
            this.add.text(100, 380, 'Ты должен управлять роботом и собирать звёздочки, уворачиваясь и отстреливаясь', { fontFamily: 'bebas', fontStyle: 'bold', fontSize: 20, color: '#000000' });
            this.add.text(100, 410, 'от вражеских коптеров, имеющих несколько жизней!', { fontFamily: 'bebas', fontStyle: 'bold', fontSize: 20, color: '#000000' });
        }else if (whatgame == 'game_2'){
	        this.add.text(100, 380, 'Ты должен управлять роботом и дойти собирать звёздочки, уворачиваясь от ракет и \nпреодолевая препятствия!', { fontFamily: 'bebas', fontStyle: 'bold', fontSize: 20, color: '#000000', lineSpacing: 6});
        }

        //вызов функции старт на нажатие пробела
        this.input.keyboard.addKey('space').on('down', this.start, this);

        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);
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
        //фон информационной области
        this.add.image(500, 300, 'blue');
        //логотип
        this.add.image(100, 80, 'agar').setDisplaySize(200,150);

        //фон игры
        this.add.image(600, 300, 'sky');

        //линия ограждения информационной области
        var info = this.physics.add.staticGroup()
        info.create(200, 300, 'line');

        //информация
        var help = ['Управление:', '· Стрелочки - перемещение \nробота;', '· Мышь - наведение лазера;', '· ЛКМ - стрельба из лазера.', '', 'Клавиши F/ESC - управление\nполноэкранным режимом.'];
        this.add.text(5, 300, help, { fontFamily: 'bebas', fontSize: 15, color: '#000', lineSpacing: 6 });

        var button1 = this.add.image(100, 550, 'but_menu', 0).setInteractive();
        button1.on('pointerup', function () {
            // затухание камеры через 125мс
            this.time.delayedCall(125, function() {
                this.cameras.main.fade(125);
            }, [], this);

            // запускаем сцену с инструкцией через 250мс
            this.time.delayedCall(250, function() {
                this.scene.start('hub');
            }, [], this);
        }, this);

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
                this.lifespan = lifespanNull;
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
        for (let i = 0; i < 5; i++) {stars.create(Phaser.Math.Between(240,960),Phaser.Math.Between(40,560),"star").setImmovable()}

        //создание физической группы - лазеры
        lasers = this.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        reticle = this.physics.add.sprite(500, 200, 'target').setBounce(1);
        reticle.setDisplaySize(15, 15).setCollideWorldBounds(true);

        game.canvas.addEventListener('mousedown', function () {game.input.mouse.requestPointerLock();});

        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
            }
        }, this);

        //создание физического робота, с глубиной 1,столкновение робота с обьектами ,столкновение робота с границами
        robot = this.physics.add.sprite(600, 300, 'robot').setDepth(1).setBounce(1).setCollideWorldBounds(true).setOrigin(0.5,0.5);
        this.physics.add.collider(robot, stars,  this.collectStar, null, this);

        //создание физической группы - бомбы
        bombs = this.physics.add.group();
        this.physics.add.overlap(bombs, lasers, this.lbhit, null, this);

        //отслеживание столкновения робота с бомбами, вызов функции при столкновении
        this.physics.add.collider(robot, bombs, this.hitBomb, null, this);

        //отслеживание физикой столкновений бомб с бомбами
        this.physics.add.collider(bombs, bombs);

        //столкновения с информационной областью, установка границыthis.lasersVisible
        this.physics.add.collider(info, bombs);
        this.physics.add.collider(info, robot);
        this.physics.add.collider(info, reticle);
        this.physics.add.overlap(info, lasers, function (info, lasers) {lasers.setVisible(false);} , null, this);

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

        //скорость
        speed = Phaser.Math.GetSpeed(300, 1);

        //создание текстового поля, выводит счёт
        coinText = this.add.text(2, 175, 'Coins: 0', { fontSize: '29px', fontStyle: 'bold', fill: '#000' });

        //создание сердечек,жизней
        hearts = this.physics.add.staticGroup();
        heart_1 = hearts.create(70, 228, 'heart').setDepth(1);
        heart_2 = hearts.create(98, 228, 'heart').setDepth(1);
        heart_3 = hearts.create(126, 228, 'heart').setDepth(1);

        // создание ракет
        rockets = this.physics.add.group();
        this.physics.add.overlap(info, rockets, function (info, rockets) {rockets.setVisible(false);} , null, this);
        this.physics.add.overlap(robot, rockets, this.hitBomb, null, this);


        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);
    }

    lbhit(bomb, laser){
        var rad = bomb.rotation
        rad += Math.PI/10
        if (rad == 0){
            bomb.disableBody(true, true);
            this.getcoin(10)
        } else {
            bomb.setRotation(rad)
        }
        laser.setVisible(false)

    }

    //функция вызывающаяся при пререкрытии лазерами звезд
    collectStar (lasers, stars){
        //перенос звезы в рандомное место
        stars.setPosition(Phaser.Math.Between(240,960),Phaser.Math.Between(40,560));

        this.getcoin(10);
        ysk += 0.5;
        lifespanNull += 4;
    }

    spawnrocket()
    {
        rocket_1 = rockets.create(250,0, 'rocket').setVelocity(robot.x*0.1,robot.y*0.1).setRotation(Phaser.Math.Angle.Between(200, 0, robot.x, robot.y)- Math.PI);
        rocket_2 = rockets.create(250,600, 'rocket').setVelocity(robot.x*0.1,-robot.y*0.1).setRotation(-Phaser.Math.Angle.Between(200, 0, robot.x, robot.y)-Math.PI);
        rocket_3 = rockets.create(950,600, 'rocket').setVelocity(-robot.x*0.1,-robot.y*0.1).setRotation(Phaser.Math.Angle.Between(200, 0, robot.x, robot.y));
        rocket_4 = rockets.create(950,0, 'rocket').setVelocity(-robot.x*0.1,robot.y*0.1).setRotation(-Phaser.Math.Angle.Between(200, 0, robot.x, robot.y));
    }

    getcoin(nominal){
        coin += nominal

        //генерация бомбы при наборе +50 очков
        if (coin % 40 == 0){
            this.spawnbomb()
        }

        if (coin % 500 == 0){
            this.spawnbomb()
            this.spawnrocket()
        }

        if (coin % 1000 == 0){
            this.spawnbomb()
        }

        //вывод счета в текстовое поле
        coinText.setText('Coins: ' + coin)
    }

    spawnbomb(){
        //генерация бомбы
        var bomb = bombs.create(Phaser.Math.Between(240,960),Phaser.Math.Between(40,560), 'bomb');
        //установка бомбе свойства отскока от препядствий без потери скорости
        bomb.setBounce(1);
        //установка бомбе свойства отскока от границ
        bomb.setCollideWorldBounds(true);
        //устанавливаем вектор движения бомбы
        bomb.setVelocity(Phaser.Math.Between(-170, 170), Phaser.Math.Between(-170, 170));
    }

    //функция, вызывающаяся при столкновении бомбы с роботом
    hitBomb (robot, bomb){
        //тряска камеры
        this.cameras.main.shake(500)

        //уменьшение хп
        hp -= 1;

        //конец игры при 3х столкновений с бомбами
        if (hp == 0){

            robot.setTint(0xff0000);
            heart_1.setActive(false);
            heart_1.setVisible(false);
            heart_1.disableBody(true, true);

            hp = 3;
            coins = coin;
            coin = 0;
            ysk = 0;
            lifespanNull = 500;
            //остановка игры
            this.physics.pause();

            // затухание камеры через 250мс
            this.time.delayedCall(500, function() {
                this.cameras.main.fade(500);
            }, [], this);

            // запускаем сцену конца игры через 500мс
            this.time.delayedCall(1000, function() {
                this.scene.start('gameOver');
            }, [], this);

        } else if (hp == 1){
            //окраска робота в красный после 2х попаданий
            robot.setTint(0xff0000);
            heart_2.setActive(false);
            heart_2.setVisible(false);
            heart_2.disableBody(true, true);
        } else if (hp == 2){
            //окраска робота в желтый после 1 попадания
            robot.setTint(0xffff00);
            heart_3.setActive(false);
            heart_3.setVisible(false);
            heart_3.disableBody(true, true);
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
            robot.setVelocityX(-150);
        } else if (cursors.right.isDown){
            robot.setVelocityX(150);
        } else {
            robot.setVelocityX(0);
        }

        //движение робота по оси у при нажатии на стрелки
        if (cursors.up.isDown){
            robot.setVelocityY(-150);
        } else if (cursors.down.isDown){
            robot.setVelocityY(150);
        } else {
            robot.setVelocityY(0);
        }

        //стрельба
        if (isDown && time > lastFired)
        {
            var laser = lasers.get();
            if (laser)
            {
                laser.fire(reticle.x, reticle.y, robot.x, robot.y);
                lastFired = time + 350 - ysk;
            }
        }
        //отслеживание роботом курсора мыши
        robot.setRotation(Phaser.Math.Angle.Between(reticle.x, reticle.y, robot.x, robot.y) - Math.PI / 2);
    }
}

// Сцена с летящим роботом
class Game_Lvl_2 extends Phaser.Scene {
    constructor (){super('game_2');}

    create ()
    {
        //фон информационной области
        this.add.image(100, 300, 'blue').setDisplaySize(200,600).setDepth(1);
        //логотип
        this.add.image(100, 80, 'agar').setDisplaySize(200,150).setDepth(1);

        //фон игры
        this.add.image(600, 200, 'background_game2');

        //линия ограждения информационной области
        var info = this.physics.add.staticGroup()
        info.create(200, 300, 'line').setDepth(1);

        //информация
        var help = ['Управление:', '· Стрелочки влево/вправо - \nперемещение робота;', '· Стрелочка вверх - взлёт.', '', 'Клавиши F/ESC - управление\nполноэкранным режимом.'];
        this.add.text(5, 300, help, { fontFamily: 'bebas', fontSize: 15, color: '#000', lineSpacing: 6 }).setDepth(1);

        var button1 = this.add.image(100, 550, 'but_menu', 0).setInteractive().setDepth(1);
        button1.on('pointerup', function () {
            // затухание камеры через 125мс
            this.time.delayedCall(125, function() {
                this.cameras.main.fade(125);
            }, [], this);

            // запускаем сцену с инструкцией через 250мс
            this.time.delayedCall(250, function() {
                this.scene.start('hub');
            }, [], this);
        }, this);

        //создание текстового поля, выводит счёт
        coinText = this.add.text(2, 175, 'Coins: 0', { fontSize: '29px', fontStyle: 'bold', fill: '#000' }).setDepth(1);
        coin = 0;

        //создание сердечек,жизней
        hearts = this.physics.add.staticGroup();
        heart_1 = hearts.create(70, 228, 'heart').setDepth(1);
        heart_2 = hearts.create(98, 228, 'heart').setDepth(1);
        heart_3 = hearts.create(126, 228, 'heart').setDepth(1);

        //создание класса снарядов лазера, свойства и события
        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize: function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'jet');
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
                this.lifespan = 200;
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

        //создание физической группы - лазеры
        lasers = this.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        //создание физического робота
        robot = this.physics.add.sprite(240, 450, 'robotsprite').setDepth(1);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('robotsprite', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'robotsprite', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('robotsprite', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //столкновение робота с обьектами
        robot.setBounce(0.2);

        //группа препятствий
        barriers = this.physics.add.group();
        barrier_1 = barriers.create(1000, 341, 'barrier_1').setOrigin(0,0).setImmovable();
        barrier_2 = barriers.create(1400, 189, 'barrier_2').setOrigin(0,0).setImmovable();

        //столкновение робота с границами
        robot.setCollideWorldBounds(true);
        this.physics.add.collider(info, robot);
        this.physics.add.collider(robot, barriers);

        //создание земли
        grounds = this.physics.add.staticGroup();
        ground_1 = grounds.create (600, 535, 'ground_game2');
        ground_2 = grounds.create (1400, 535, 'ground_game2');

        //гравитация для робота
        robot.body.setGravityY(300)

        //робот стоит на земле
        this.physics.add.collider(robot, grounds);
        this.physics.add.collider(grounds, barriers);

        //отслеживание нажатий стелочек на клавиатуре
        cursors = this.input.keyboard.createCursorKeys();

        // создание ракет
        rockets = this.physics.add.group();
        rocket = rockets.create(1000, Phaser.Math.Between(20,460), 'rocket').setOrigin(0, 0);
        rocket.setVelocityX(-100);

        //отслеживание столкновения робота с ракетами, вызов функции при столкновении
        this.physics.add.collider(robot, rockets, this.hitRocket, null, this);

        //фуллскрин
        this.input.keyboard.addKey('F').on('down', function () {this.scale.startFullscreen();}, this);

        //создание физической группы - звезды
        stars = this.physics.add.group();

        //генерация звезд
        star_1 = stars.create(Phaser.Math.Between(240, 450), Phaser.Math.Between(20, 450), 'star');
        star_2 = stars.create(Phaser.Math.Between(450, 650), Phaser.Math.Between(20, 450), 'star');
        star_3 = stars.create(Phaser.Math.Between(650, 850), Phaser.Math.Between(20, 450), 'star');
        star_4 = stars.create(Phaser.Math.Between(850, 1000), Phaser.Math.Between(20, 450), 'star');

        //отслеживание перекрытия роботом звёзд, вызов функции при перекрытии
        this.physics.add.overlap(robot, stars, this.collectStar, null, this);

        //отслеживание перекрытия препятствиями звёзд, вызов функции при перекрытии
        this.physics.add.overlap(barriers, stars, this.pushStar, null, this);

        //отслеживание столкновения препятстий с ракетами, вызов функции при столкновении
        this.physics.add.collider(barriers, rockets, this.barriersRockets, null, this);
    }

    barriersRockets (barriers, rocket) {
        //удаление ракеты при столкновении
        rocket.setActive(false);
        rocket.setVisible(false);
        rocket.disableBody(true, true);

        rocket = rockets.create(1000, Phaser.Math.Between(20,460), 'rocket').setOrigin(0, 0);
        rocket.setVelocityX(Phaser.Math.Between(-200, -50));
    }

    //функция, вызываемая при перекрытии звёзд и препятствий
    pushStar (barriers, stars) {
        //перенос звезды в рандомное место
        stars.setPosition(Phaser.Math.Between(1010, 1100), Phaser.Math.Between(20, 450));
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

        rocket = rockets.create(1000, Phaser.Math.Between(20,460), 'rocket').setOrigin(0, 0);
        rocket.setVelocityX(-100);
    }

    //функция вызывающаяся при пререкрытии лазерами звезд
    collectStar (robot, stars){
        //перенос звезы в рандомное место
        stars.setPosition(Phaser.Math.Between(1010,1100), 450);

        coin += 10;
        //вывод счета в текстовое поле
        coinText.setText('Coins: ' + coin)
    }

    update (time, delta)
    {
        timeR++

        //движение робота по оси х при нажатии на стрелки
        if (cursors.left.isDown){
            robot.anims.play('left', true);
            robot.setVelocityX(-100);
        } else if (cursors.right.isDown){
            robot.anims.play('right', true);
            robot.setVelocityX(100);
        } else {
            robot.anims.play('turn', true);
            robot.setVelocityX(0);
        }

        //прыжок && robot.body.touching.down
        if (cursors.up.isDown )
        {
            robot.setVelocityY(-200);
        }

        //генерация летящих ракет
        if (robot.x > 300 && timeR % 400 == 0)
        {
            for (var i = 0; i < Phaser.Math.Between(1,5); i++) {
                rocket = rockets.create(Phaser.Math.Between(1000,1100), Phaser.Math.Between(20,460), 'rocket').setOrigin(0, 0);
                rocket.setVelocityX(Phaser.Math.Between(-50,-200));
            }
        }

        //генерация препятствий
        if (barrier_1.x <= -145 || barrier_2.x <= -145)
        {
            var i = Phaser.Math.Between(1,4);

            if (i == 1 && setbarrier % 2 == 0) {
                barrier_1 = barriers.create(1000, 341, 'barrier_1').setOrigin(0,0).setImmovable();
            }else if (i == 1 && setbarrier % 2 != 0) {barrier_2 = barriers.create(1000, 341, 'barrier_1').setOrigin(0,0).setImmovable();}

            if (i == 2 && setbarrier % 2 == 0) {
                barrier_1 = barriers.create(1000, 189, 'barrier_2').setOrigin(0,0).setImmovable();
            }else if (i == 2 && setbarrier % 2 != 0) {barrier_2 = barriers.create(1000, 189, 'barrier_2').setOrigin(0,0).setImmovable();}

            if (i == 3 && setbarrier % 2 == 0) {
                barrier_1 = barriers.create(1000, 125, 'barrier_3').setOrigin(0,0).setImmovable();
            }else if (i == 3 && setbarrier % 2 != 0) {barrier_2 = barriers.create(1000, 125, 'barrier_3').setOrigin(0,0).setImmovable();}

            if (i == 4 && setbarrier % 2 == 0) {
                barrier_1 = barriers.create(1000, 341, 'barrier_4').setOrigin(0,0).setImmovable();
            }else if (i == 4 && setbarrier % 2 != 0) {barrier_2 = barriers.create(1000, 341, 'barrier_4').setOrigin(0,0).setImmovable();}

            setbarrier++;
        }

        //стрельба
        if (cursors.up.isDown  && cursors.right.isUp && cursors.left.isUp && time > lastFired)
        {
            var laser_1 = lasers.get();

            if (laser_1)
            {
                laser_1.fire(robot.x, robot.y+100, robot.x+10, robot.y+3);
                lastFired = time + 50;
            }
            var laser_2 = lasers.get();
            if (laser_2)
            {
                laser_2.fire(robot.x, robot.y+100, robot.x-10, robot.y+3);
                lastFired = time + 50;
            }
        } else if (cursors.up.isDown && cursors.right.isDown && time > lastFired){
            var laser_3 = lasers.get();

            if (laser_3)
            {
                laser_3.fire(robot.x, robot.y+100, robot.x-10, robot.y+3);
                lastFired = time + 50;
            }
        } else if (cursors.up.isDown && cursors.left.isDown && time > lastFired){
            var laser_4 = lasers.get();

            if (laser_4)
            {
                laser_4.fire(robot.x, robot.y+100, robot.x+10, robot.y+3);
                lastFired = time + 50;
            }
        }

        //движение земли, звёзд и препятствий
        if (robot.x > 740 && cursors.right.isDown) {
            robot.anims.play('right', true);
            robot.setVelocityX(2);
            speed = 2
            ground_1.x = ground_1.x - speed;
            ground_2.x = ground_2.x - speed;

            if (ground_1.x < -200){
                ground_1.x = 1395;
            }
            if (ground_2.x < -200){
                ground_2.x = 1395;
            }

            barrier_1.x = barrier_1.x - speed;
            barrier_2.x = barrier_2.x - speed;

            star_1.x = star_1.x - speed;
            star_2.x = star_2.x - speed;
            star_3.x = star_3.x - speed;
            star_4.x = star_4.x - speed;

            if (star_1.x < 190){
                star_1.x = Phaser.Math.Between(1010, 1100);
            }
            if (star_2.x < 190){
                star_2.x = Phaser.Math.Between(1010, 1100);
            }
            if (star_3.x < 190){
                star_3.x = Phaser.Math.Between(1010, 1100);
            }
            if (star_4.x < 190){
                star_4.x = Phaser.Math.Between(1010, 1100);
            }
        }
    }
}

class GameOver extends Phaser.Scene {
    constructor (){super('gameOver');}

    create ()
    {

        //фон
        this.add.image(500, 300, 'blue');

        //логотип
        this.add.image(500, 100, 'agar');

        //текстовое содержание
        this.add.text(500, 270, 'Игра окончена!', { fontFamily: 'bebas', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setOrigin(0.5);
        this.add.text(500, 400, 'Счёт: '+coins, { fontFamily: 'bebas', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setOrigin(0.5);
        this.add.text(500, 520, 'Жми пробел, чтобы вернуться на начальный экран!', { fontFamily: 'bebas', fontSize: 26, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setOrigin(0.5);

        //вызов функции перезапуска по нажатию пробела
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
        width: 1000,
        height: 600
    },
    pixelArt: true,
    physics: {
        default: 'arcade', arcade: {debug: false}
    },
    scene: [Boot, Hub, Instructions, Game_Lvl_1, Game_Lvl_2, GameOver]
};

var game = new Phaser.Game(config);

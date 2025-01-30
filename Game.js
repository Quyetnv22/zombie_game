const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

let player;
let cursors;
let bullets;
let zombies;
let lastFired = 0;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://i.imgur.com/8D4XBwP.png'); // Hình nhân vật
    this.load.image('bullet', 'https://i.imgur.com/TWpxFkb.png'); // Hình đạn
    this.load.image('zombie', 'https://i.imgur.com/HyApcjC.png'); // Hình zombie
}

function create() {
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    zombies = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', shootBullet, this);

    this.time.addEvent({ delay: 1000, callback: spawnZombie, callbackScope: this, loop: true });

    this.physics.add.overlap(bullets, zombies, killZombie, null, this);
}

function update(time) {
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);

    if (cursors.up.isDown) player.setVelocityY(-200);
    else if (cursors.down.isDown) player.setVelocityY(200);
    else player.setVelocityY(0);
}

function shootBullet() {
    const bullet = bullets.get(player.x, player.y - 20);
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -300;
    }
}

function spawnZombie() {
    const x = Phaser.Math.Between(50, 750);
    const zombie = zombies.create(x, 0, 'zombie').setScale(0.5);
    zombie.setVelocityY(100);
}

function killZombie(bullet, zombie) {
    bullet.destroy();
    zombie.destroy();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(() => {
    let url = `https://aquatic-cuboid-tumbleweed.glitch.me/senddata?hurtRate=${getRandomInt(50, 200)}&oxlvl=${getRandomInt(60, 100)}&roomId=R1`;
    fetch(url).then(() => { });
}, 1000);
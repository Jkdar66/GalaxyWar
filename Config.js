export const BULLET_TYPE = {
    // BLUE: "images\\LaserBullet\\LaserBlue.png",
    // GREEN: "images\\LaserBullet\\LaserGreen.png",
    // PURPLE: "images\\LaserBullet\\LaserPurple.png",
    RED: "images\\laser\\red.png"
    // SKYBLUE: "images\\LaserBullet\\LaserSkyBlue.png",
    // YELLOW: "images\\LaserBullet\\LaserYellow.png"
};
export const AsteroidSize = [
    {
        key: "small",
        type: ["a", "b"],
        number: [
            [100, 300, 400],
            [100, 300, 400]
        ],
        imgWidth: 64,
        imgHeight: 64
    },
    {
        key: "medium",
        type: ["a", "b", "c", "d"],
        number: [
            [100, 300, 400],
            [400],
            [100, 300, 400],
            [100, 300, 400]
        ],
        imgWidth: 120,
        imgHeight: 120
    },
    {
        key: "large",
        type: ["a", "b", "c"],
        number: [
            [100, 300],
            [100, 300],
            [100, 300, 400]
        ],
        imgWidth: 320,
        imgHeight: 240
    }
];

export const BULLET_TYPE = {
    RED: "images\\laser\\red.png"
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
export var FlameType;
(function (FlameType) {
    FlameType["RED"] = "images\\flame\\red\\flame_";
    FlameType["BLUE"] = "images\\flame\\blue\\flame_";
})(FlameType || (FlameType = {}));

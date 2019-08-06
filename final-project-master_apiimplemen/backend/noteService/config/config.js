const port = (process.env.PORT || 3001);
const jwtSpecification = {
    secretKey: "01EYs3rmZe33p6yWEo3LEA",
    expiresIn: "2 days",
    algorithm: "HS256"
};

module.exports = {
    port,
    jwtSpecification
};
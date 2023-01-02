
// @desc Logs request to console this logger uses morgan
const logger = (req, res, next) => {
    req.hello = "Hellow World";
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next()
}


export default logger
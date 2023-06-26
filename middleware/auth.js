const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
    try {     
        const token = req.header('Authorization').replace('Bearer ', '');
        req.user = jwt.verify(token, process.env.SECRET);                        
        next();
    } catch (error) {
        res.status(401).send({error: error.message});
    }
}

// function auth(req, res, next) {
//     try {
//         const refreshToken = req.header('Authorization').replace('Bearer ', '');
//         if (refreshToken) {
//             // verifies secret and checks exp
//             const result = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
//                 if (err) {
//                     return res.status(401).json({ "error": true, "message": 'Unauthorized access.', error: err });
//                 }

//                 req.decoded = decoded;
//             });
//             console.log("VERIFY RESULT: " + result);
//             console.log("VERIFY RESULT: " + JSON.stringify(result));
//             console.log("REQ.USER: " + req.decoded);
//             console.log("REQ.USER: " + JSON.stringify(req.decoded));
//             next();
//         } else {
//             // if there is no token
//             // return an error
//             return res.status(403).send({
//                 "error": true,
//                 "message": 'No token provided.'
//             });
//         }
//     } catch (error) {
//         res.status(401).send({ error: error.message });
//     }
// }

// function verifyRefresh(resfreshToken) {
//     try {
//         const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);


//         return decoded.email === "emailDePrueba";
//     } catch (error) {
//         // console.error(error);
//         return false;
//     }
// }

module.exports = auth;
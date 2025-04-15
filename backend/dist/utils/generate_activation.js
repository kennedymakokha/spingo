"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeActivationCode = void 0;
const MakeActivationCode = (length) => {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};
exports.MakeActivationCode = MakeActivationCode;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format_phone_number = void 0;
const Format_phone_number = (phone_number) => {
    let Refined;
    if (phone_number.charAt(0) === "0") {
        let newPhone = phone_number.slice(1);
        Refined = "+254".concat(newPhone);
        return Refined;
    }
    else if (phone_number.substring(0, 4) === "+254") {
        return phone_number;
    }
};
exports.Format_phone_number = Format_phone_number;

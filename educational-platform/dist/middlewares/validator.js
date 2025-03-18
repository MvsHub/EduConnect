"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = void 0;
const validation_1 = require("../utils/validation");
// Middlewares de validação para cada tipo de requisição
exports.validators = {
    register: (0, validation_1.validate)(validation_1.validationSchemas.register),
    login: (0, validation_1.validate)(validation_1.validationSchemas.login),
    updateProfile: (0, validation_1.validate)(validation_1.validationSchemas.updateProfile),
    createPost: (0, validation_1.validate)(validation_1.validationSchemas.createPost),
    updatePost: (0, validation_1.validate)(validation_1.validationSchemas.updatePost),
    createComment: (0, validation_1.validate)(validation_1.validationSchemas.createComment),
};

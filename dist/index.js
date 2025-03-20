'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(import('express'));
const dotenv_1 = __importDefault(import('dotenv'));
// configures dotenv to work in your application
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const PORT = process.env.PORT;
app.get('/', (request, response) => {
    response.status(200).send('Hello World');
});
app.listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
}).on('error', (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
// export default app;

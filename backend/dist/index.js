"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const openai = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.KIMI_API_KEY,
});
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield openai.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        max_tokens: 200,
        messages: [
            {
                role: "user",
                content: prompt
            },
            {
                role: "system",
                content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything else just return node or react only"
            }
        ]
    });
    const answer = response.choices[0].message.content;
    if (answer === 'react') {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all the files of the project visible to you.\nConsider the contents of all files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [react_1.basePrompt]
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [node_1.basePrompt],
            message: "This is node"
        });
        return;
    }
    res.status(403).json({ message: "not accessible this time" });
    // console.log(answer)
    return;
}));
app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body.messages;
    // console.log(messages)
    const response = yield openai.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        max_tokens: 200,
        messages: [
            ...messages,
            {
                role: "system",
                content: (0, prompts_1.getSystemPrompt)()
            }
        ]
    });
    // // console.log(messages)
    console.log(response.choices[0].message.content);
    res.json({
        response: response.choices[0].message.content
    });
    return;
}));
app.listen(3000);
// async function main() {
//   const stream = await openai.chat.completions.create({
//     model: "openai/gpt-oss-20b:free",
//     messages: [
//       {
//         role: "system",
//         content: getSystemPrompt()
//       },
//       {
//         role: "user",
//         content: ""
//       },
//       {
//         role: "user",
//         content: "build a todo application"
//       }
//     ],
//     stream: true
//   });
//   // console.log(msg.choices[0].message.content);
//   for await (const chunk of stream) {
//     const content = chunk.choices[0]?.delta?.content;
//     if (content) {
//       process.stdout.write(content); // print without adding a new line each time
//     }
//   }
// }
// main();

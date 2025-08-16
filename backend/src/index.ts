require('dotenv').config();
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import { basePrompt as nodeBasePrompt } from './defaults/node'
import { basePrompt as reactBasePrompt } from './defaults/react'


const app = express()
app.use(express.json())
app.use(cors())

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_KEY,
});



app.post('/template', async (req, res) => {
  const prompt = req.body.prompt

  const response = await openai.chat.completions.create({
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
  
  const answer = response.choices[0].message.content

   if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({message: "You cant access this"})
    return;
  
})

app.post('/chat', async (req, res) => {
  const messages = req.body.messages;

  // console.log(messages)

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [
      ...messages,
      {
        role: "system",
        content: getSystemPrompt()
      }
    ]
  });

  // // console.log(messages)

  console.log(response.choices[0].message.content)
  
  res.json({
    response: response.choices[0].message.content
  })
  return
})





app.listen(3000)


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








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
const port = process.env.PORT || 3000 

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});



app.post('/template', async (req, res) => {
  const prompt = req.body.prompt

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
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
  
  const answer = response?.choices[0]?.message?.content?.trim()
  console.log(answer)

   if (answer === "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
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

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      ...messages,
      {
        role: "system",
        content: getSystemPrompt()
      }
    ]
  });

  const answer = response?.choices[0]?.message?.content?.trim()
  res.json({
    answer
  })
  return
})





app.listen(port, () => {
  console.log(`server is running on Port ${port}`);
});


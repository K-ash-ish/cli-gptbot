#!/usr/bin/env node
const { Configuration, OpenAIApi } = require("openai");
const inquirer = require("inquirer");
const { createSpinner } = require("nanospinner");
const chalk = require("chalk");
require("dotenv").config();

const spinner = createSpinner();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  // replace this with your own OpenAI API
});

const openai = new OpenAIApi(configuration);

const gptResponse = async (message) => {
  spinner.start();
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    spinner.success();
    return completion.data.choices[0].message.content;
  } catch (error) {
    // console.error("error");
    console.log(chalk.redBright("Something went wrong"));
    process.exit(0);
  }
};
const yourResponse = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: chalk.greenBright("You: "),
        name: "yourResponse",
      },
    ])
    .then(async (answer) => {
      if (answer.yourResponse.length === 0) {
        console.log("Response was empty");
        return;
      } else {
        const gpt = await gptResponse(answer.yourResponse);
        console.log(chalk.magentaBright("GPT: ") + gpt + "\n");
        yourResponse();
      }
    });
};
console.log(
  chalk.yellowBright("Welcome to CLI chatbot.") +
    chalk.redBright(" Ctrl+C to exit.\n")
);
yourResponse();

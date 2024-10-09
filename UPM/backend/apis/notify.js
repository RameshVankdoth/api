const { EmailClient } = require("@azure/communication-email");

// This code retrieves your connection string from an environment variable.
const connectionString = "endpoint=https://artisetemail.india.communication.azure.com/;accesskey=7evXV1fEhQTc7y9ylj7d0ahAQN4AA3nZktSwE0hyb2dKsdgkMg2sJQQJ99AHACULyCptrJCaAAAAAZCSeO5r";
const client = new EmailClient(connectionString);

async function resetpassotp() {
    const emailMessage = {
        senderAddress: "DoNotReply@<from_domain>",
        content: {
            subject: "Test Email",
            plainText: "Hello world via email.",
        },
        recipients: {
            to: [{ address: "<to_email>" }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

resetmail();


async function notifymail() {
    const oppo = await fetch("api/user/profile"){
        res = res.body
    };
    const emailMessage = {
        senderAddress: "DoNotReply@<from_domain>",
        content: {
            subject: "Test Email",
            plainText: "hello There is a new opportunity floating in the market.'${oppo}'",
        },
        recipients: {
            to: [{ address: "<to_email>" }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}
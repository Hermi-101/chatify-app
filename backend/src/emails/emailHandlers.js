import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplet.js"


export const sendWelcomEmail = async (email, name, clientURL) => {
    const {data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatify!",
        html: createWelcomeEmailTemplate(name, clientURL)
    });

    if(error){
        console.error("Error sending welcome email:", error);
        throw new Error("Faild to send welcome email");
    }
    
    
} 
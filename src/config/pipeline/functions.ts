import { inngestClient } from "./client";

export const helloWorldFunction = inngestClient.createFunction(
    {
        id: "hello-world",
        triggers: [{event: "app/hello.world"}]
    },
    async({event, step}) => {
        console.log("Hello World! Event received:", event.name);

        // step 1: greet the user
        const result1 = await step.run("create-greeting", async () => {
            const name = event.data.name;
            const message = `Hello, ${name}!`;
            console.log("Greeting created:", message);
            return message;
        })

        console.log("Step 1 successful. Result:", result1);
        
        const result2 = await step.run("step-2", async () => {
          const name = event.data.name;
          const message = `Step 2 completed for ${name}!`;
          console.log("did you finish step 1?? OFC YES MAN!!!");
          return message;
        });
        
        return {
            message: "finished executing steps",
            step1Result: result1,
            step2Result: result2,
            eventId: event.id,
            finishedAt: new Date().toISOString()
        }
    }
);

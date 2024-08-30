import { 
    app, 
    output,
    HttpRequest, 
    HttpResponseInit, 
    InvocationContext, 
    StorageQueueOutput 
} from "@azure/functions";


const sendToQueue: StorageQueueOutput = output.storageQueue({
    queueName: 'outqueue',
    connection: 'AzureWebJobsStorage',
  })


export async function HelloWorld(
    request: HttpRequest, 
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        context.log(`Hello function processed request for url "${request.url}"`);

        const name = request.query.get('name');
        if (!name) {
            context.log(`Found name: ${name}`);
        } else {
            context.log(`No name found.`)
        }

        if (name) {
            context.extraOutputs.set(sendToQueue, [`${name} said hello!`]);
            return { status: 200, body: `Hello ${name}, nice to meet you!` };
        } else {
            return { status: 200, body: `Hello! Did you know you can pass your name in as a parameter?` };
        }
    } catch (error) {
        context.log(`Error: ${error}`);
        return { status: 500, body: 'Internal Server Error' };
    }
};


app.http('hello', {
    methods: ['POST'],
    extraOutputs: [sendToQueue],
    authLevel: 'anonymous',
    handler: HelloWorld
});

async function sendMultipleMails(mails) {
    let sendMails = 0;
    // logic for
    // sending multiple mails
    for(let i = 0; i < 10000000000; i++) {
        // DO
        sendMails++;
    }
    return sendMails;
}


// receive message from master process
process.on('message', async (message) => {
    const numberOfMailsSend = await sendMultipleMails(message.mails); 

    // send response to master process
    process.send({ counter: numberOfMailsSend });
});

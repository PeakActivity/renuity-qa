const core = require('@actions/core');
const pack = require('./packageFile')
const {addComment} = require('./modules/jira')

function formatResults(passed, failed, ticket){
    const PASS = !failed?.length;
    let message = `QA for ${ticket} : ${PASS ? 'PASSED:' : 'FAILED:'}`;
    for(const i of failed){
        message += `\n\t- ${i.title} : ${i.status}`
        for(const e of i.error){
            message += `\n\t\t- ${e}`
        }
    }

    for (const i of passed) {
        message += `\n\t- ${i.title} : ${i.status}`
    }
    return message;
}

try {

    const ticket = process.env.ticket;

    const {passed, failed} = pack();
    const PASS = !failed?.length;

    const message = formatResults(passed, failed, ticket)


    addComment(message);
    return message;
} catch (error) {
    core.setFailed(error.message);
}

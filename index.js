const core = require('@actions/core');
const pack = require('./packageFile')
const {addComment} = require('./modules/jira')


try {

    const testPage = process.env.testPage;
    const prodPage = process.env.prodPage;
    const ticket = process.env.ticket;
    console.log({testPage, prodPage, ticket});

    const {passed, failed} = pack();

    const PASS = !failed?.length;

    let message = `QA ${PASS ? 'PASSED:' : 'FAILED:'}`;
    for(const i of failed){
        message += `\n\t- ${i.title} : ${i.status}`
        for(const e of i.error){
            message += `\n\t\t- ${e}`
        }
    }

    for (const i of passed) {
        message += `\n\t- ${i.title} : ${i.status}`
    }

    addComment(message);
    return message;
} catch (error) {
    core.setFailed(error.message);
}

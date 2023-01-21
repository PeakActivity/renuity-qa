const core = require('@actions/core');
const pack = require('./packageFile')

function formatResults(passed, failed, ticket, results){
    const PASS = !failed?.length;
    let message = `QA ${PASS ? `PASSED` : `FAILED`}`;
    for(const i of results){
        message += `\n- ${i.title} : ${i.status}`
        if(i.error){
            for(const e of i.error){
                message += `\n    - ${e}`
            }
        }

    }

    return message;
}

try {

    const ticket = process.env.ticket;

    const {passed, failed, results} = pack();
    const PASS = !failed?.length;

    const _results = formatResults(passed, failed, ticket, results)
    core.setOutput('results', _results)
    return _results;
} catch (error) {
    core.setFailed(error.message);
}

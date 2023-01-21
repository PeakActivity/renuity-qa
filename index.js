const core = require('@actions/core');
const pack = require('./packageFile')

function formatResults(ticket, results){
    let PASS = true;
    let message = ``;
    for(const i of results){
        message += `\n- ${i.title} : ${i.status}`
        if(i.error){
            PASS  = false;
            for(const e of i.error){
                message += `\n\t- ${e}`
            }
        }
    }

    let summary = `QA ${PASS ? `PASSED` : `FAILED`}`;

    return summary+message;
}

try {

    const ticket = process.env.ticket;

    const {results} = pack();

    const _results = formatResults(ticket, results)
    core.setOutput('results', _results)
    return _results;
} catch (error) {
    core.setFailed(error.message);
}

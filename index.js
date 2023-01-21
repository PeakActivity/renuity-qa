const core = require('@actions/core');
const pack = require('./packageFile')

function formatResults(ticket, results){
    let passed = true;
    let message = ``;
    for(const i of results){
        message += `\n- ${i.title} : ${i.status}`
        if(i.error){
            passed  = false;
            for(const e of i.error){
                message += `\n\t- ${e}`
            }
        }
    }

    let summary = `QA ${passed ? `PASSED` : `FAILED`}`;

    const result = summary+message;
    return {result, passed}
}

try {

    const ticket = process.env.ticket;

    const {result, passed} = pack();

    const _results = formatResults(ticket, result)
    core.setOutput('results', _results)
    core.setOutput('passed', passed)
    return _results;
} catch (error) {
    core.setFailed(error.message);
}

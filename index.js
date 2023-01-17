const core = require('@actions/core');
const pack = require('./packageFile')

try {

    const testPage = core.getInput('testPage');
    const prodPage = core.getInput('prodPage');
    const ticket = core.getInput('ticket');
    console.log({testPage, prodPage, ticket});

    const {passed, failed} = pack();
    console.log('done packing')

    console.log(`${failed.length} tests failed`);
    console.table(failed)
    console.log(`${passed.length} tests passed`);
    console.table(passed)

    return {passed, failed};
} catch (error) {
    core.setFailed(error.message);
}

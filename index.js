const core = require('@actions/core');
const pack = require('./packageFile')

try {

    const testPage = process.env.testPage;
    const prodPage = process.env.prodPage;
    const ticket = process.env.ticket;
    console.log({testPage, prodPage, ticket});

    const {passed, failed} = pack();

    console.log(`${failed.length} tests failed`);
    console.table(failed)
    console.log(`${passed.length} tests passed`);
    console.table(passed)

    return {passed, failed};
} catch (error) {
    core.setFailed(error.message);
}

/** @implements {import('@playwright/test/reporter').Reporter} */
class MyReporter {
    onTestEnd(test, result) {
        console.log(`\n- ${test.title} : ${result.status}`);
        if(result.status === 'failed'){
            for(const error of result.errors){
                console.log(` -- ${error.message}`)
            }
        }

    }
}

module.exports = MyReporter;

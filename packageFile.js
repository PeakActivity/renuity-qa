const fs = require('fs');
const strip = require('strip-color');
const TEST_FILE = 'test-results.json';

function pack() {
    try {
        const _data = fs.readFileSync(TEST_FILE, 'utf8');
        const data = JSON.parse(_data);
        const suite = data?.suites?.[0]?.specs;

        const passed = [];
        const failed = [];
        const results = []

        for( const i of suite){
            const error = i.tests[0]?.results[0]?.error?.message;

            const test = {
                title: i.title,
                status: i.tests[0]?.status === 'expected' ? 'pass' : 'FAIL',
            }

            if(error){
                test.error = strip(error)?.split('\n');
            }


            if(test.status === 'fail'){
                const clean = [];
                for (const i of test.error){
                    if (i && !i.includes('expect(received)')){
                        clean.push(i)
                    }
                }
                test.error = [...clean];
            }

            //console.log(test)

            if(test.status === 'pass'){
                passed.push(test);
            }else {
                failed.push(test);
            }
            results.push(test)
        }

        return {failed, passed, results}
    } catch (err) {
        console.error(err);
    }
}

module.exports = pack;

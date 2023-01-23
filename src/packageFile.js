const fs = require('fs');
const strip = require('strip-color');
const TEST_FILE = 'test-results.json';

function pack() {
    try {
        const _data = fs.readFileSync(TEST_FILE, 'utf8');
        const data = JSON.parse(_data);
        const suite = data?.suites?.[0]?.specs;
        const results = []

        for( const i of suite){
            const error = i.tests[0]?.results?.[0]?.error?.message;

            const test = {
                title: i.title,
                status: i.tests[0]?.status === 'expected' ? 'pass' : 'FAIL',
            }

            if(error){
                test.error = strip(error)?.split('\n');
            }

            if(test.status === 'FAIL'){
                const clean = [];

                if(!Array.isArray(test.error)){
                    test.error = [test.error]
                }
                for (const i of test?.error){
                    if (i && !i.includes('expect(received)')){
                        clean.push(i)
                    }
                }

                test.error = [...clean];
            }

            results.push(test)
        }

        return results
    } catch (err) {
        console.error(err);
    }
}

module.exports = pack;

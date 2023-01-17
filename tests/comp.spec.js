const core = require('@actions/core');
const { DateTime } = require("luxon");
const {expect, test} = require("@playwright/test");

let PROD_PAGE;
let TEST_PAGE;
test.beforeAll(() => {
        PROD_PAGE = process.env.prodPage; //core.getInput('prodPage');
        TEST_PAGE = process.env.testPage; //core.getInput('testPage');
        console.log('starting tests for ', {PROD_PAGE, TEST_PAGE})
    }
)

const cleanList = (items) => items.map(i => i?.trim()).filter(i => i).sort()

test('Titles match', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodTitle = await page.title();

    await page.goto(TEST_PAGE);
    const testTitle = await page.title();

    //console.log({prodTitle, testTitle})
    await expect(testTitle).toEqual(prodTitle);
});

test('Descriptions match', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodDescr = await page.locator('meta[name="description"]')?.getAttribute('content');

    await page.goto(TEST_PAGE);
    const testDescr = await page.locator('meta[name="description"]')?.getAttribute('content');
    //console.log({prodDescr, testDescr})
    await expect(testDescr).toEqual(prodDescr);
});

test('content h1 matches', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodContent = cleanList(await page.locator("h1").allInnerTexts());

    await page.goto(TEST_PAGE);
    const testContent = cleanList(await page.locator("h1").allInnerTexts());

    //console.log({prodContent, testContent})
    await expect(testContent).toEqual(prodContent);
});

test('content h2 matches', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodContent = cleanList(await page.locator("h2").allInnerTexts());

    await page.goto(TEST_PAGE);
    const testContent = cleanList(await page.locator("h2").allInnerTexts());

    //console.log({prodContent, testContent})
    await expect(testContent).toEqual(prodContent);
});

test('Yoast SEO exists', async ({ page }) => {
    await page.goto(TEST_PAGE);
    const testContent = await page.content();
    expect(testContent).toContain('Yoast')
});

test('publish date matches', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodDateString = await page.innerText(".post-date");
    const prodDate = new Date(prodDateString);

    await page.goto(TEST_PAGE);
    const testDateHTML = await page.innerText(".yoast-schema-graph");
    const testDateParsed = (JSON.parse(testDateHTML))["@graph"]
    const testDateString = testDateParsed.map(i => i.datePublished).filter(i => i)[0];
    const testDate = new Date(testDateString);

    const prodDateFormatted = prodDate.toDateString();
    const testDateFormatted = testDate.toDateString()

    //console.dir({testDate, testDateFormatted, prodDate, prodDateFormatted})
    await expect(testDateFormatted).toEqual(prodDateFormatted);
});

test('featured image exists', async ({ page }) => {
    await page.goto(TEST_PAGE);
    const testDateHTML = await page.innerText(".yoast-schema-graph");
    const testDateParsed = (JSON.parse(testDateHTML))["@graph"]
    const testImage = testDateParsed.map(i => i.thumbnailUrl).filter(i => i)[0];

    console.log(testImage)
    if(!testImage){
        throw new Error('featured image is missing')
    }
});

test('tags match', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodTagsHTML = await page.innerText("h4");
    const prodTagsExist = prodTagsHTML === 'Tags';
    const prodFoundHTML = await page.locator(`a[href*='t.']`).allInnerTexts();
    const prodTags = prodFoundHTML?.filter(i => i !== `LIKE US ON FACEBOOK`)?.sort();

    await page.goto(TEST_PAGE);
    const testTagsHTML = await page.innerText("h4");
    const testTagsExist = testTagsHTML === 'Tags';
    const testFoundHTML = await page.locator(`a[href*='/tag/']`).allInnerTexts();
    const testTags = testFoundHTML?.map(i => i?.toUpperCase()).sort();
    expect(testTagsExist).toEqual(prodTagsExist);

    if(prodTagsExist){
        expect(testTags).toEqual(prodTags);
    }





});

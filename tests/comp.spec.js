const core = require('@actions/core');
const { DateTime } = require("luxon");
const {expect, test} = require("@playwright/test");

let PROD_PAGE;
let TEST_PAGE;
test.beforeAll(() => {
        PROD_PAGE = process.env.prodPage;
        TEST_PAGE = process.env.testPage;
    }
)

const cleanList = (items) => items
    .map(i => i?.trim())
    .filter(i => i)
    .map(i => i.replace(`’`,`'`))
    .sort()

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
    await expect(testDescr).toEqual(prodDescr);
});

test('Content h1 matches', async ({ page }) => {
    await page.goto(PROD_PAGE);
    const prodContent = cleanList(await page.locator("h1").allInnerTexts());

    await page.goto(TEST_PAGE);
    const testContent = cleanList(await page.locator("h1").allInnerTexts());

    //console.log({prodContent, testContent})
    await expect(testContent).toEqual(prodContent);
});

test('Content h2 matches', async ({ page }) => {
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

test('Publish date matches', async ({ page }) => {
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

test('Tags match', async ({ page }) => {
    let prodTagsExist, prodTags;
    let testTagsExist, testTags;

    await page.goto(PROD_PAGE);
    try {
        const prodTagsHTML = await page.innerText("h4", {timeout: 3 * 1000});
        prodTagsExist = prodTagsHTML === 'Tags';
        const prodFoundHTML = await page.locator(`a[href*='t.']`).allInnerTexts();
        prodTags = prodFoundHTML
            ?.filter(i => i !== `LIKE US ON FACEBOOK`)
            ?.filter(i => i !== `Follow us on Pinterest`)
            ?.map(i => i.toUpperCase())
            ?.sort();
    }catch(e){

    }

    await page.goto(TEST_PAGE);
    try {
        const testTagsHTML = await page.innerText("h4", {timeout: 3 * 1000});
        testTagsExist = testTagsHTML === 'Tags';
        const testFoundHTML = await page.locator(`a[href*='/tag/']`).allInnerTexts();
        testTags = testFoundHTML?.map(i => i?.toUpperCase()).sort();
    }catch (e){

    }

    expect(testTags).toEqual(prodTags);

});

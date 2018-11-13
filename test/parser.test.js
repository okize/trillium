const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

describe('test description', () => {
  // load fixture
  beforeAll(async () => {
    try {
      global.trilliumWebsiteHtml = await readFile('./test/fixtures/trillium_beer_2018_10_18.html', 'utf8');
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(() => {
    global.trilliumWebsiteHtml = undefined;
  });

  it('is html', async () => {
    expect(global.trilliumWebsiteHtml).toMatch(/<!doctype html>/);
  });
});

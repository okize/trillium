const fs = require('fs');
const { promisify } = require('util');
const $ = require('cheerio');

const {
  getBeerImageUrl,
  getBeerCanPrice,
} = require('../src/parser');


describe('parser', () => {
  // load fixture
  beforeAll(async () => {
    const readFile = promisify(fs.readFile);
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

  describe('getBeerImageUrl', () => {
    const imageHtml = '<img data-src="http://example.com/image.jpg" class="summary-thumbnail-image" />';
    const $imageHtml = $(`<div>${imageHtml}</div>`);

    it('returns an image url', () => {
      expect(getBeerImageUrl($imageHtml)).toBe('http://example.com/image.jpg');
    });

    it('returns null if image element is not found', () => {
      expect(getBeerImageUrl($(`${imageHtml}`))).toBeNull();
    });

    it('returns null if no class name is present', () => {
      const missingClassHtml = '<img data-src="http://example.com/image.jpg" />';
      const $missingClassHtml = $(`<div>${missingClassHtml}</div>`);

      expect(getBeerImageUrl($missingClassHtml)).toBeNull();
    });

    it('returns null if no data-src is found', () => {
      const missingDataSrc = '<img src="http://example.com/image.jpg" class="summary-thumbnail-image" />';
      const $missingDataSrc = $(`<div>${missingDataSrc}</div>`);

      expect(getBeerImageUrl($missingDataSrc)).toBeNull();
    });

    it('exects a cheerio objct', () => {
      expect(() => { getBeerImageUrl(imageHtml); }).toThrowError();
    });
  });

  describe('getBeerPrice', () => {
    const imageHtml = `
      <span class="summary-metadata-item summary-metadata-item--tags">
      <a href="/trillium-beers-fort-point/?tag=1+case+limit+per+person+%28%2422.20+per+4-pack%29">
      1 case limit per person ($22.20 per 4-pack)
      </a>
      </span>
    `;


    it('returns an image url', () => {
      expect(getBeerImageUrl($imageHtml)).toBe('http://example.com/image.jpg');
    });
  });
});

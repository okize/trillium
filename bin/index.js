#!/usr/bin/env node

const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');
const Table = require('cli-table3');

const TRILLIUM_WEBSITE_URL = 'http://www.trilliumbrewing.com';
const requestOpts = {
  headers: { 'User-Agent': 'request' },
};

const normalizeBackupBeerName = (name) => {
  const normalizedName = name
    .replace(/trillium/ig, '') // remove `trillium`
    .replace(/_|-/g, ' ') // replace hyphens and underscores with spaces
    .replace('.', '') // remove period
    .replace(/gif|png|jpg|jpeg/ig, ' ') // remove image file extensions
    .trim(); // remove leading whitespace

  return normalizedName;
};

const getBeerName = ($el) => {
  const name = $el.find('.summary-thumbnail-container').data('title');
  const backupName = $el.find('.summary-thumbnail-container img').attr('alt');

  if (name.length) {
    return name;
  }
  if (backupName.length) {
    return normalizeBackupBeerName(backupName);
  }
  return 'Unknown beer name';
};

const getBeerPrice = ($el) => {
  const description = $el.find('.summary-metadata--primary').text();
  const re = /(\$.*) (per|for) 4-pack/i;
  const hasCans = description.match(re);

  if (hasCans) {
    return hasCans[1];
  }
  return null;
};

const getBeerDescriptionUrl = ($el) => {
  const description = $el.find('.summary-thumbnail-container');
  const path = description.attr('href');
  const url = `${TRILLIUM_WEBSITE_URL}${path}`;
  return url;
};

const getBeerImageUrl = ($el) => {
  const image = $el.find('.summary-thumbnail-image');
  const imageUrl = image.data('src');
  return imageUrl;
};

const getBeerData = ($beerList) => {
  const beers = _.map($beerList, (beer) => {
    const beerData = {
      name: getBeerName($(beer)),
      price: getBeerPrice($(beer)),
      url: getBeerDescriptionUrl($(beer)),
      image: getBeerImageUrl($(beer)),
    };
    return beerData;
  });
  const onlyCannedBeers = beers.filter(beer => beer.price !== null);
  return _.sortBy(onlyCannedBeers, 'name');
};

const renderAvailabilityTable = (locations) => {
  const table = new Table({
    head: ['Location', '', 'Name', '4-pack Price'],
  });

  locations.forEach(([locationLabel, html]) => {
    const data = getBeerData(html);
    const header = { rowSpan: data.length, content: locationLabel, vAlign: 'center' };

    data.forEach(({ name, price }, i) => {
      if (i === 0) {
        table.push([header, i + 1, name, price]);
      } else {
        table.push([i + 1, name, price]);
      }
    });
  });

  console.log(table.toString());
};

const parseTrilliumWebsite = (error, response, body) => {
  if (error) {
    return console.error(error);
  }

  global.$ = cheerio.load(body);

  const $locations = $('.summary-item-list-container');
  const $fortPointBeerList = $('.summary-item', $locations[0]);
  const $cantonBeerList = $('.summary-item', $locations[1]);

  return renderAvailabilityTable([['Fort Point', $fortPointBeerList], ['Canton', $cantonBeerList]]);
};

request(`${TRILLIUM_WEBSITE_URL}/beers`, requestOpts, parseTrilliumWebsite);

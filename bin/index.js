#!/usr/bin/env node

const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');
const Table = require('cli-table3');

const trilliumUrl = 'http://www.trilliumbrewing.com';
const requestOpts = {
  headers: { 'User-Agent': 'request' },
};

const parseTrilliumWebsite = (error, response, body) => {
  if (error) {
    return console.error(error);
  }

  const $ = cheerio.load(body);

  const getBeerName = $el => $el.find('.summary-thumbnail-container').data('title');

  const getBeerPrice = ($el) => {
    const description = $el.find('.summary-metadata-container--below-content').text();
    const re = /\$.* for 4-pack/i;
    const hasCans = description.match(re);

    if (hasCans) {
      return hasCans[0].replace(' for 4-pack', '');
    }
    return null;
  };

  const getBeerData = ($beerList) => {
    const beers = _.map($beerList, (beer) => {
      const beerData = {
        name: getBeerName($(beer)),
        price: getBeerPrice($(beer)),
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

  const $locations = $('.summary-item-list-container');
  const $fortPointBeerList = $('.summary-item', $locations[0]);
  const $cantonBeerList = $('.summary-item', $locations[1]);

  return renderAvailabilityTable([['Fort Point', $fortPointBeerList], ['Canton', $cantonBeerList]]);
};

request(trilliumUrl, requestOpts, parseTrilliumWebsite);